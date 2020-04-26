const Constants = require("./constants.js");
const Drawing = require("./drawing.js");
const Input = require("./input.js");

class Game {
    constructor(socket, drawing, input) {
        this.socket = socket;
        this.drawing = drawing;
        this.input = input;

        this.cards = [];
        this.players = [];
        this.lastCard = null;
        this.isTurn = false;
    }

    static create(socket, canvasElementID) {
        const canvas = document.getElementById(canvasElementID);
        canvas.width = Constants.CANVAS_WIDTH;
        canvas.height = Constants.CANVAS_HEIGHT;

        const drawing = Drawing.create(canvas);
        const input = Input.create(document, canvas);

        const game = new Game(socket, drawing, input);
        game.init();

        return game;
    }

    init() {
        this.lastUpdateTime = Date.now();
        this.socket.on(
            Constants.SOCKET_UPDATE,
            this.onReceiveGameState.bind(this)
        );
    }

    onReceiveGameState(state) {
        this.cards = state.cards;
        this.playersCards = state.playersCards;
        this.lastCard = state.lastCard;
        this.turn = state.turn;
        console.log("received game state.");
    }

    run() {
        this.update();
        this.draw();
    }

    update() {
        if (this.self) {
            this.socket.emit(Constants.SOCKET_PLAYER_ACTION, {
                cardPlayed: cardPlayed,
                cards: this.cards,
            });
        }
    }

    draw() {
        this.drawing.clear();
        this.drawing.drawBackground();

        this.drawing.drawFrontCards(this.cards);
        this.players.forEach((cards) => this.drawing.drawBackCards(cards));
        // this.drawing.drawDiscardedCard(lastCard);
    }
}

const socket = io();

socket.on("message", function (data) {
    console.log(data);
});

module.exports = Game;
