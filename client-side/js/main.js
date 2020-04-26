const $ = require("jquery");
const io = require("socket.io-client");

const Constants = require("./constants.js");
const Game = require("./game.js");

$(document).ready(() => {
    const socket = io();
    let game = Game.create(socket, "canvas");

    $("#name-input").focus();

    const createPlayer = () => {
        const name = $("#name-input").val();
        console.log("joining as " + name + "...");
        if (name && name.length < 20) {
            socket.emit("new-player", {
                name: name,
            });

            $("#name-prompt-container").empty();
            $("#name-prompt-container").append(
                "<button id='start-game'>Começar o jogo</button>"
            );
            $("#canvas").focus();
        } else {
            window.alert(
                "Seu nome não pode ser vazio e precisa ter menos de 20 caracteres."
            );
        }
    };

    const startGame = () => {
        console.log("starting game...");
        socket.emit(Constants.SOCKET_START_GAME);
        if (socket.on("start-game-ok")) {
            $("#name-prompt-container").empty();
            // start game from client
            game.run();
        } else if (socket.on("start-game-error", returnData)) {
            window.alert("Um erro ocorreu: " + returnData);
        }
    };

    socket.on("players-online", (data) => {
        $("#player-list").html("Jogadores: \n<ul>");
        for (const name of data) {
            $("#player-list").append("<li>" + name + "</li>");
        }
        $("#player-list").append("</ul>");
        console.log(data);
    });

    $("#join-game").click(createPlayer);
    $("#name-form").submit(createPlayer);
    $("#start-game").click(startGame);
});
