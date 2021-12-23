const express = require("express"),
    http = require("http"),
    app = express(),
    port = process.env.PORT || 3000,
    socketio = require("socket.io"),
    path = require("path"),
    homeController = require("./homeController"),
    utils = require("./utils"),
    Board = require("./game"),
    states = {},
    clientRooms = {};

const server = http.createServer(app);
const io = socketio(server, {
    cors: {
        origin: "*"
    }
});

app.set("port", port);
app.use(express.static(path.join("../public")));

app.get("/", homeController.showHome)
    .get("/offline", homeController.showOffline)
    .get("/online", homeController.showOnline)
    .get("/online-game", homeController.showOnlineGame);

io.on("connection", socket => {
    socket.on("message", (message, id) => {
        io.emit("message", `${id}: ${message}`);
    });
    
    socket.on("create-room", sendId => {
        const roomId = utils.makeId(clientRooms);
        const board = new Board();
        states[roomId] = board;
        console.log(`Create Room: ${socket.id}`);
        clientRooms[socket.id] = roomId;
        socket.join(roomId);
        sendId(roomId);
    });

    socket.on("validId", (roomId, validId) => {
        console.log(`Join Room: ${socket.id}`);
        const room = io.sockets.adapter.rooms.get(roomId);
        if (room && room.size === 1) 
            validId(true); 
        else 
            validId(false);
    });

    socket.on("init", roomId => {
        console.log(`init ${socket.id}`);
        clientRooms[socket.id] = roomId;
        socket.join(roomId);
        io.sockets.in(roomId).emit("init", clientRooms[roomId]);
    });
    
    socket.on("disconnect", () => {
        const clientRoomId = clientRooms[socket.id];        
        delete states[clientRoomId];
        delete states[socket.id];
    });
});

server.listen(port, () => {
    console.log(`The server is listening on port ${port}`);
});