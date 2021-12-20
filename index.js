const express = require("express"),
    app = express(),
    port = process.env.PORT || 3000,
    io = require("socket.io")();

app.set("port", port);
app.use(express.static("public"));

app.get("/", (req, res) => {
    const options = {
        root: __dirname
    };
    res.sendFile("views/home.html", options);
})
.get("/offline", (req, res) => {
    const options = {
        root: __dirname
    };
    res.sendFile("views/offline.html", options); 
});

app.listen(port, () => {
    console.log(`The server is listening on port ${port}`);
});