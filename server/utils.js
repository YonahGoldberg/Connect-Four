exports.makeId = (clientRooms) => {
    const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    let id = "";
    for (let i = 0; i < 6; i++) {
        let rnum = Math.floor(Math.random() * chars.length);
        id += chars.substring(rnum,rnum+1);
    }
    const keys = Object.keys(clientRooms);
    for (i of keys) {
        if (clientRooms[i] === id)
            return this.makeId(clientRooms);
    }
    return id;
}

exports.redOrBlack = () => {
    const rnum = Math.floor(Math.random() * 2);
    if (rnum === 0) return "red";
    return "black";
}