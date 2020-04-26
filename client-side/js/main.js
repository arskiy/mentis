const $ = require("jquery");
const io = require("socket.io-client");

const Constants = require("./constants.js");
const Game = require("./game.js");

$(document).ready(() => {
    const socket = io();
    let game = Game.create(socket, "canvas");

    $("#name-input").focus();

    const start = () => {
        console.log("starting...");
        const name = $("#name-input").val();
        if (name && name.length < 20) {
            socket.emit("new-player", {
                name: name,
            });
            $("#name-prompt-container").empty();
            $("#canvas").focus();
            game.run();
        } else {
            window.alert(
                "Seu nome não pode ser vazio e precisa ter menos de 20 caracteres."
            );
        }
    };
    $("#start-game").click(start);
    $("#name-form").submit(start);
});
