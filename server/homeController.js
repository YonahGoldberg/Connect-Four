exports.showHome = (req, res) => {
    const options = {
        root: __dirname
    };
    res.sendFile("views/home.html", options);
};

exports.showOffline = (req, res) => {
    const options = {
        root: __dirname
    };
    res.sendFile("views/offline.html", options); 
};

exports.showOnline = (req, res) => {
    const options = {
        root: __dirname
    };
    res.sendFile("views/online.html", options);
};

exports.showOnlineGame = (req, res) => {
    const options = {
        root: __dirname
    };
    res.sendFile("views/online-game.html", options);
};