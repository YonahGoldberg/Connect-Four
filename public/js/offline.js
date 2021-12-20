let board = [];
for (let i = 0; i < 49; i++) {
    board.push("empty");
}

function renderBoard() {
    document.getElementById("game").innerHTML = "";
    for (let i = 0; i < board.length; i++) {
        let div = document.createElement("div");
        if (board[i] === "red")
            div.className = "red";
        else if (board[i] = "black")
            div.className = "black";
        document.getElementById("game").appendChild(div);
    }
}



