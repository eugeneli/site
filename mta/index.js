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
    }

    getClientStations() {
        return Object.values(this.clients).map(client => client.station);
    }

    async buildStations() {
        const res = await this.mta.stop();

        this.stations = Object.values(res)
            .filter(stop => stop.parent_station === "") //Only keep parent station
            .map(stop => {
                const trainStop = {
                    stationId: stop.stop_id,
                    stationName: stop.stop_name
                }
                
                return trainStop;
            });
    }

    startPolling() {
        this.poll = setInterval(async () => {
            const clientStations = this.getClientStations();
            const res = await this.mta.schedule(clientStations);

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
    }

    async start() {
        this.wss.on("connection", (socket, req) => {
            const ip = req.connection.remoteAddress;
            console.log(`New connection: ${ip}`);

            //Send over the list of stations
            if(socket.readyState === WebSocket.OPEN)
                socket.send(JSON.stringify({ type: "stations", stations: this.stations }));

            this.clients[ip] = new Client(ip, null, socket);

            socket.isAlive = true;
            socket.on("pong", heartbeat);
            socket.on("message", (msg) => {
                if(msg.length <= 5)
                {
                    console.log(`Added station: ${msg}`);
                    this.clients[ip].station = msg;
                }
            });

            this.startPolling();
        });

        await this.buildStations();


        //test

        const res = await this.mta.stop();
        console.log(res);
        //console.log(Object.values(res).filter(stop => stop.stop_name.includes("Herald")))

        const res2 = await this.mta.schedule(["D17", "M13"]);
        console.log(res2)
        console.log(res2.schedule["D17"]["N"])

        //console.log(Object.values(res).filter(stop => stop.stop_name.includes("Lorimer")))
        //console.log(Object.values(res))
    }
}
