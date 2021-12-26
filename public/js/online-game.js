const socket = io();
let socketId;
let chatBox;
let messageInput;
let sendMessageButton;
const gameAndChat = document.getElementById("gameAndChat");

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

socket.on("init", gameState => {
    const h3 = document.getElementById("room");
    if (h3) h3.remove();
    renderChat();
    renderGame(gameState);
});

socket.on("render", gameState => {
    deRenderGame();
    renderGame(gameState);
});

socket.on("message", (message) => {
    displayMessage(message);
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
    const container = document.createElement("div");
    container.id = "container";
    container.className = "vert";
    gameAndChat.appendChild(container);
    let h3 = document.createElement("h3");
    h3.id="turn";       

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
   
    if (win) {
        const horiz = document.createElement("div");
        horiz.id = "horiz";
        horiz.className = "horiz"; 
        const vert = document.createElement("div");
        vert.className = "vert";
        vert.id = "vert";
        const btn = document.createElement("button");
        btn.innerText = "Request Rematch";
        btn.addEventListener("click", e => {
            const h5 = document.createElement("h5");
            h5.innerText = "Waiting For Opponent...";
            vert.appendChild(h5);
            socket.emit("rematch");
        });
        vert.appendChild(btn);
        horiz.appendChild(h3);
        horiz.appendChild(vert);
        container.appendChild(horiz);
    }  
    else 
        container.appendChild(h3);

    let gameDiv = document.createElement("div");``
    gameDiv.className = "game";
    gameDiv.id = "game";
    container.appendChild(gameDiv);
    
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
    let container = document.getElementById("container");
    if (container) {
        gameAndChat.removeChild(container);
    }
    let horiz = document.getElementById("horiz");
    if (horiz) {
        gameAndChat.removeChild(horiz);
    }
}

function renderChat() {
    const chatDiv = document.createElement("div");
    chatDiv.className = "chat";
    chatDiv.id = "chat";
    const box = document.createElement("div");
    chatBox = box;
    box.className = "box";
    box.id = "box";
    const h3 = document.createElement("h3");
    h3.innerText = "Room Chat";
    const form = document.createElement("form");
    form.onsubmit = e => {
        e.preventDefault();
        const message = messageInput.value;
        if (message !== "") {
            socket.emit("roomMessage", message);
            messageInput.value = "";
        }
    }
    const vert = document.createElement("div");
    vert.className = "vert";
    vert.id = "vert";
    const label = document.createElement("label");
    label.innerText = "Message";
    const input = document.createElement("input");
    messageInput = input;
    input.type = "text";
    input.id = "message";
    input.name = "message";
    const btn = document.createElement("button");
    sendMessageButton = btn;
    btn.type = "button";
    btn.id = "sendMessage";
    btn.innerText = "Send Message";
    btn.addEventListener("click", e => {
        e.preventDefault();
        const message = messageInput.value;
        if (message !== "") {
            socket.emit("roomMessage", message);
            messageInput.value = "";
        }
    });
    chatDiv.appendChild(h3);
    chatDiv.appendChild(box);
    chatDiv.appendChild(form);
    form.appendChild(vert);
    form.appendChild(btn);
    vert.appendChild(label);
    vert.appendChild(input);
    gameAndChat.appendChild(chatDiv);
}

function displayMessage(message) {
    const div = document.createElement("div");
    div.className = "message";
    div.textContent = message;
    chatBox.appendChild(div);
}
