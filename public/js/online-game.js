const socket = io();
let socketId;

socket.on("connect", () => {
    socketId = socket.id;
    if(getQueryVariable("created") === "true") {
        const username = getQueryVariable("username");
        socket.emit("create-room", username, id => {
            showRoomCode(id);
        });
    }
    else {
        const roomId = getQueryVariable("room");
        const username = getQueryVariable("username");
        socket.emit("init", username, roomId);
    }
});

socket.on("init", (gameState) => {
    const h3 = document.getElementById("room");
    if (h3) h3.remove();
    renderGame(gameState);
});

socket.on("render", gameState => {
    deRenderGame();
    renderGame(gameState);
});


function showRoomCode(id) {
    const h3 = document.createElement("h3");
    h3.id = "room";
    h3.innerText = `Room Code: ${id}`;
    document.body.appendChild(h3);
}

function getQueryVariable(variable) {
    var query = window.location.search.substring(1);
    var vars = query.split('&');
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split('=');
        if (decodeURIComponent(pair[0]) == variable) {
            return decodeURIComponent(pair[1]);
        }
    }
    console.log('Query variable %s not found', variable);
}

function renderGame(gameState) {    
    let h3 = document.createElement("h3");
    h3.id="turn";       
    
    console.log(gameState.red);
    console.log(gameState.black);

    let myColor;
    let oppColor;
    if (gameState.red.id === socketId) {
        myColor = "red";
        oppColor = "black";
    }
    else {
        myColor = "black";
        oppColor = "red";
    }
    
    let win = false;
    if (gameState.winner === myColor) {
        win = true;
        h3.innerText = "You win!";
    }
    else if (gameState.winner === oppColor) {
        win = true;
        if (oppColor === "red")
            h3.innerText = `${gameState.red.username} Wins!`;
        else
            h3.innerText = `${gameState.black.username} Wins!`;
    }
    else if (gameState.turn === "black") {
        if (myColor === "black")
            h3.innerText = "Your Turn (Black)";
        else
            h3.innerText = `${gameState.black.username}'s Turn (Black)`;
    }   
    else {
        if (myColor === "red")
            h3.innerText = "Your Turn (Red)";
        else
            h3.innerText = `${gameState.red.username}'s Turn (Red)`;
    }  
    document.body.appendChild(h3);

    let gameDiv = document.createElement("div");
    gameDiv.className = "game";
    gameDiv.id = "game";
    document.body.appendChild(gameDiv);
    
    for (let i = 0; i < gameState.model.length; i++) {
        let circle = document.createElement("div");
        circle.id = "circle";
        const piece = gameState.model[i];
        if (piece === "red")
            circle.className = "red";
        else if (piece === "black")
            circle.className = "black";
        else if (piece === "empty")
            circle.className = "empty";
        else {
            circle.className = "bottom";
        }
        
        let square = document.createElement("div");
        if (circle.className === "bottom")
            square.className = "bottomSquare";
        else
            square.className = "square";
        circle.appendChild(square);
        if (!win) {
            circle.onclick = e => {
                e.preventDefault();
                socket.emit("move", i);
            }
        }

        document.getElementById("game").appendChild(circle);
    }
}

function deRenderGame() {
    let gameDiv = document.getElementById("game");
    if (gameDiv)
        document.body.removeChild(gameDiv); 
    let h3 = document.getElementById("turn");
    if (h3)
        document.body.removeChild(h3);
}
