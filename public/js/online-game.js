const socket = io();
const username = sessionStorage.getItem("username");

socket.on("connect", () => {
    if(getQueryVariable("created") === "true") {
        socket.emit("create-room", id => {
            showRoomCode(id);
        });
    }
    else {
        const roomId = getQueryVariable("room");
        socket.emit("init", roomId);
    }
});

socket.on("init", (board) => {
    const h3 = document.getElementById("room");
    if (h3) h3.remove();
    renderBoard(board);
});


function showRoomCode(id) {
    const h3 = document.createElement("h3");
    h3.id="room";
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

function renderBoard(board) {    
    let h3 = document.createElement("h3");
    h3.id="turn";       
    
    if (board.turn === "black")
        h3.innerText = "Black's Turn";
    else
        h3.innerText = "Red's Turn";
    document.body.appendChild(h3);

    let gameDiv = document.createElement("div");
    gameDiv.className = "game";
    gameDiv.id = "game";
    document.body.appendChild(gameDiv);
    
    for (let i = 0; i < this.board.length; i++) {
        let circle = document.createElement("div");
        circle.id = "circle";
        const piece = this.board[i];
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
        document.getElementById("game").appendChild(circle);
    }
}

function unRenderBoard() {
    let gameDiv = document.getElementById("game");
    if (gameDiv)
        document.body.removeChild(gameDiv); 
    let h3 = document.getElementById("turn");
    if (h3)
        document.body.removeChild(h3);
}
