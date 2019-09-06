const WebSocket = require("ws");
const MTA = require("mta-gtfs");

module.exports = class MTAServer {
    constructor(apiKey) {
        this.port = 8085;
        this.mta = new MTA({
            key: apiKey,
            feed_id: 21
          });

        this.wss = new WebSocket.Server({ port: this.port });

        this.isPolling = false;
    }

    getClients() {
        return [ ...this.wss.clients ];
    }

    getClientStations(clients) {
        return clients
                    .map(client => client.station)
                    .filter(station => station !== undefined);
    }

    async buildStations() {
        const res = await this.mta.stop();

        this.stations = Object.values(res)
            .filter(stop => stop.parent_station === "") //Only keep parent station
            .map(stop => {
                const trainStop = {
                    id: stop.stop_id,
                    label: `${stop.stop_name} (${stop.stop_id})`
                }
                
                return trainStop;
            });
    }

    //For some reason, some stations require querying a specific feed while others don't
    //So query every single feed to be sure
    async queryFeeds(stations) {
        stations.push("D17")
        const feeds = [ 1, 26, 16, 21, 2, 11, 31, 36, 51 ];
        const getSchedule = async (stationIds, feedId) => {
            return new Promise(async resolve => {
                try {
                    const res = await this.mta.schedule(stationIds, feedId);
                    resolve(res);
                }
                catch(e) {
                    resolve({});
                }
            });
        }

        const schedulePs = feeds.map(id => getSchedule(stations, id));
        const schedules = (await Promise.all(schedulePs))
                            .filter(res => res["schedule"] !== undefined)
                            .reduce((acc, cur) => {
                                Object.keys(acc.schedule).forEach(key => {
                                    const north = cur.schedule[key]["N"];
                                    const south = cur.schedule[key]["S"];

                                    if(north.length > 0)
                                        acc.schedule[key]["N"] = acc.schedule[key]["N"].concat(north);
                                    if(south.length > 0)
                                        acc.schedule[key]["S"] = acc.schedule[key]["S"].concat(south);
                                });

                                return acc;
                            });

        return schedules;
    }

    async fetchArrivals(clients) {
        const clientStations = this.getClientStations(clients);
        if(clients.length == 0 || clientStations.length == 0)
            return this.stopPolling();

        console.log(`Clients: ${clients.length}, Stations: ${clientStations.length}`)

        const res = await this.queryFeeds(clientStations);

        clients
            .filter(client => client.station !== undefined)
            .forEach(client => {
                const resp = { type: "update", schedule: res.schedule[client.station] };
                if(client.readyState === WebSocket.OPEN)
                    client.send(JSON.stringify(resp));
            });
    }

    startPolling() {
        this.isPolling = true;
        this.poll = setInterval(() => this.fetchArrivals(this.getClients()), 5000);
    }

    stopPolling() { 
        console.log("No clients. Stopping polling.");
        clearInterval(this.poll);
        this.isPolling = false;
    }

    async start() {
        this.wss.on("connection", (socket, req) => {
            const ip = req.connection.remoteAddress;
            console.log(`New connection: ${ip}`);

            //Send over the list of stations
            if(socket.readyState === WebSocket.OPEN) {
                socket.send(JSON.stringify({ type: "stations", stations: this.stations }));
            }

            socket.on("message", (msg) => {
                if(msg.length <= 5)
                {
                    console.log(`Added station: ${msg}`);
                    socket.station = msg;

                    this.fetchArrivals([ socket ]);

                    if(!this.isPolling)
                        this.startPolling();
                }
            });

            if(!this.isPolling)
                this.startPolling();
        });

        await this.buildStations();
    }
}
