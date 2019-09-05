const WebSocket = require("ws");
const MTA = require("mta-gtfs");

class Client {
    constructor(ip, station, socket) {
        this.ip = ip;
        this.station = station;
        this.socket = socket;
    }
}

module.exports = class MTAServer {
    constructor(apiKey) {
        this.port = 8085;
        this.mta = new MTA({
            key: apiKey,
            feed_id: 21
          });

        this.wss = new WebSocket.Server({ port: this.port });
        this.clients = {};

        this.isPolling = false;
    }

    getClientStations() {
        return Object.values(this.clients)
                    .map(client => client.station)
                    .filter(station => station !== null);
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
                                        acc.schedule[key]["N"] = north;
                                    if(south.length > 0)
                                        acc.schedule[key]["S"] = south;
                                });

                                return acc;
                            });

        return schedules;
    }

    startPolling() {
        this.isPolling = true;
        this.poll = setInterval(async () => {
            const clientStations = this.getClientStations();
            if(clientStations.length == 0)
                return;

            console.log(`Clients: ${this.wss.clients.size}, Stations: ${clientStations.length}`)

            const res = await this.queryFeeds(clientStations);

            Object.values(this.clients)
                .filter(client => client.station !== null)
                .forEach(client => {
                    const resp = { type: "update", schedule: res.schedule[client.station] };
                    if(client.socket.readyState === WebSocket.OPEN)
                        client.socket.send(JSON.stringify(resp));
                    else
                    {
                        client.socket.terminate();
                        if(this.wss.clients.size === 0)
                            this.stopPolling();
                        
                        delete this.clients[client.ip];
                    }
                });

        }, 5000);
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
                console.log("sent ;)")
            }

            this.clients[ip] = new Client(ip, null, socket);

            socket.on("message", (msg) => {
                if(msg.length <= 5)
                {
                    console.log(`Added station: ${msg}`);
                    this.clients[ip].station = msg;
                }
            });

            if(!this.isPolling)
                this.startPolling();
        });

        await this.buildStations();


        //test

        const res = await this.mta.stop();
        //console.log(res);
        //console.log(Object.values(res).filter(stop => stop.stop_name.includes("Greenpoint")))

        const res2 = await this.mta.schedule(["624"], 1);//await this.mta.schedule(["D17", "M13", "G36"], 31);
        //console.log(res2)
        console.log(res2.schedule["624"]["N"])

        //console.log(Object.values(res).filter(stop => stop.stop_name.includes("Lorimer")))
        //console.log(Object.values(res))
    }
}
