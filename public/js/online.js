const chatBox = document.getElementById("chat");
const messageInput = document.getElementById("message");
const sendMessageButton = document.getElementById("sendMessage");
const joinRoomButton = document.getElementById("join-room");
const createRoomButton = document.getElementById("create-room");
const usernameInput = document.getElementById("username");
const roomIdInput = document.getElementById("room-id");

const socket = io();

socket.on("connect", () => {
    displayMessage(`You connected with id: ${socket.id}`);
});

socket.on("message", (message) => {
    displayMessage(message);
});

function displayMessage(message) {
    const div = document.createElement("div");
    div.className = "message";
    div.textContent = message;
    chatBox.appendChild(div);
}

sendMessageButton.addEventListener("click", e => {
    e.preventDefault();
    const message = messageInput.value;
    if (message !== "") {
        socket.emit("message", message, socket.id);
        messageInput.value = "";
    }
});

createRoomButton.addEventListener("click", e => {
    e.preventDefault();
    location.href=`/online-game?username=${usernameInput.value}&created=true`;
});

joinRoomButton.addEventListener("click", e => {
    e.preventDefault();
    const roomId = roomIdInput.value;
    socket.emit("validId", roomId, validId => {
        if (validId) {
            location.href=`/online-game?username=${usernameInput.value}&room=${roomId}&created=false`;
        }
        else 
            document.getElementById("noRoom").innerText = "Invalid Room Code";
    });
});


