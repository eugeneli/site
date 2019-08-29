const WebSocket = require("ws");
const MTA = require("mta-gtfs");

class Client {
    constructor(ip, stop, socket) {
        this.ip = ip;
        this.stop = stop;
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

    start() {
        this.wss.on("connection", (socket, req) => {
            const ip = req.connection.remoteAddress;
            console.log(`New connection: ${ip}`);
            
            this.clients[ip] = new Client(ip, "M13", socket);

            socket.on("message", (msg) => {
                console.log(`received: ${msg}`);
                this.clients[ip].stop = msg;
            });
        });

        this.poll = setInterval(async () => {
            const res = await this.mta.schedule("M13", 21);
            //console.log(res.schedule["M13"])

            Object.values(this.clients)
                .filter(client => client.stop === "M13")
                .forEach(client => {
                    client.socket.send(JSON.stringify(res));
                });

        }, 5000);

        //console.log(Object.values(res).filter(stop => stop.stop_name.includes("Lorimer")))
        //console.log(Object.values(res))
    }
}
