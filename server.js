const PORT = process.env.PORT || 5000;
const FPS = 60;
const cards_num = 52;

const express = require("express");
const http = require("http");
const path = require("path");
const socketIO = require("socket.io");

const Game = require("./server-side/game-server.js");

const app = express();
const server = http.Server(app);
const io = socketIO(server);
let game = Game.create();

app.set("port", PORT);
app.use("/client-side", express.static(__dirname + "/client-side"));

// Routing
app.get("/", function (request, response) {
    response.sendFile(path.join(__dirname, "index.html"));
});

setInterval(function () {
    io.sockets.emit("message", "hi");
}, 2500);

let gameStarted = false;

io.on("connection", (socket) => {
    socket.on("new-player", (data) => {
        game.addNewPlayer(data.name, socket);
        game.sendPlayersNames();
    });

    socket.on("start-game", () => {
        console.log("server received start-game...");
        if (game.startGame()) {
            gameStarted = true;
            socket.emit("started-game-ok");
        } else {
            socket.emit(
                "started-game-error",
                "Para iniciar um jogo, você precisa ter entre 2 e 6 pessoas na partida."
            );
        }
    });

    socket.on("player-action", (data) => {
        game.getState(socket.id, data);
        game.sendState();
    });

    socket.on("disconnect", () => {
        game.removePlayer(socket.id);
    });
});

/*
var players = {};
io.on("connection", function (socket) {
    socket.on("new-player", function (socket) {
        players[socket.id] = {
            cards: [],
        };
    });


  socket.on('start game'), function() {
    let player_cards_n = cards_num / player.length;
    for (let player = 0; player < players.length; player++) {
      let player_cards = [];
      for (let player_card = 0; player_card < player_cards_n; player_card++) {
        let carta = Math.floor(Math.random() * 13);
        let suit = Math.floor(Math.random() * 4);
        let card = {
          card: carta,
          suit: suit,
        }
        player_cards.push(card)
      }
      players[player] = { cards: player_cards };
    }
  }

    socket.on("card-played", function (data) {});
});
*/

// Starts the server.
server.listen(PORT, function () {
    console.log("Starting server on port " + PORT);
});
