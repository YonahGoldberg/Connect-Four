const express = require("express"),
    http = require("http"),
    app = express(),
    port = process.env.PORT || 3000,
    socketio = require("socket.io"),
    game = require("./game"),
    GameState = game.GameState,
    path = require("path"),
    homeController = require("./homeController"),
    utils = require("./utils"),
    states = {},
    clientRooms = {};

const server = http.createServer(app);
const io = socketio(server, {
    cors: {
        origin: "*"
    }
});

app.set("port", port);
app.use(express.static(path.join(__dirname, "../public")));

app.get("/", homeController.showHome)
    .get("/offline", homeController.showOffline)
    .get("/online", homeController.showOnline)
    .get("/online-game", homeController.showOnlineGame);

io.on("connection", socket => {
    socket.on("join-global", () => {
        socket.join("global");
    })
    
    socket.on("message", (message, id) => {
        io.sockets.to("global").emit("message", `${id}: ${message}`);
    });

    socket.on("roomMessage", message => {
        const room = clientRooms[socket.id];
        let gameState = states[room];
        if (!gameState) return;
        let username;
        if (gameState.red.id === socket.id) 
            username = gameState.red.username;
        else
            username = gameState.black.username; 
        io.sockets.to(room).emit("message", `${username}: ${message}`);
    });
    
    socket.on("create-room", (username, sendId) => {
        const roomId = utils.makeId(clientRooms);
        const gameState = new GameState();
        const color = utils.redOrBlack();
        game.setPlayer(gameState, socket.id, username, color);
        
        states[roomId] = gameState;
        clientRooms[socket.id] = roomId;
        socket.join(roomId);
        sendId(roomId);
    });

    socket.on("validId", (roomId, validId) => {
        const room = io.sockets.adapter.rooms.get(roomId);
        if (room && room.size === 1) 
            validId(true); 
        else 
            validId(false);
    });

    socket.on("init", (username, roomId) => {
        clientRooms[socket.id] = roomId;
        let gameState = states[roomId];
        if (!gameState) return;
        if (gameState.red.id === "")
            game.setPlayer(gameState, socket.id, username, "red");
        else
            game.setPlayer(gameState, socket.id, username, "black");
        socket.join(roomId);
        io.sockets.in(roomId).emit("init", states[roomId]);
    });

    socket.on("move", i => {
        let room = clientRooms[socket.id];
        let gameState = states[room];
        if (!gameState) return;
        let clientColor;
        if (gameState.red.id === socket.id) clientColor = "red";
        else clientColor = "black";
        if (gameState.turn === "red" && clientColor === "red"
        || gameState.turn === "black" && clientColor === "black") {
            const piece = gameState.model[i];
            const pieceBelow = gameState.model[i + 7];
            if ((pieceBelow === "black" || pieceBelow === "red" || pieceBelow === "bottom")
            &&  piece === "empty") {
                gameState.model[i] = clientColor;
                game.changeTurn(gameState);
                if (game.win(gameState, "red")) {
                    gameState.winner = "red";
                    gameState.red.wins += 1;
                }
                else if (game.win(gameState, "black")) {
                    gameState.winner = "black";
                    gameState.black.wins += 1;
                }
                io.sockets.in(room).emit("render", gameState);
            }
        }
    });
    
    socket.on("rematch", () => {
        let room = clientRooms[socket.id];
        let gameState = states[room];
        if (!gameState) return;
        if (gameState.rematch) {
            gameState.winner = "none";
            gameState.rematch = false;
            gameState.model = game.initModel();
            io.sockets.in(room).emit("render", gameState);
        }
        else {
            gameState.rematch = true;
            console.log("Hello");
        }
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
