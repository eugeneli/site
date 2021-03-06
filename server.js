const publicIp = require("public-ip");
const express = require("express");
const MTA = require("./mta");
const app = express();
const PORT = 80;
app.use(express.static("build"));

const handlePath = (reqPath) => {
    const path = reqPath.substr(1).split("/");

    return path.length > 1 ? reqPath : `${path[0]}/index.html`;
}

app.get("/haters*", function (req, res) {
    res.sendFile(handlePath(req.path), { root: __dirname + "/memes" });
});

app.get("/*", function (req, res) {
    res.sendFile("build/index.html", { root: __dirname });
});

app.listen(PORT, async () => {
    if(process.argv.length > 2)
    {
        const mta = new MTA(process.argv[2]);
        mta.start();
        console.log(`MTA WS on port ${mta.port}`);
    }

    const IP = await publicIp.v4();

    console.log(`Listening on port ${PORT}\n`);
    
    console.log("===========================================");
    console.log(`Local:            http://localhost:${PORT}`);
    console.log(`Public:           http://${IP}:${PORT}`);
    console.log("===========================================");
});
