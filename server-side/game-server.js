const Player = require("./player.js");

class GameServer {
    constructor() {
        /**
         * This is a Map containing all the connected socket ids and socket
         * instances.
         */
        this.clients = new Map();
        /**
         * This is a Map containing all the connected socket ids and the players
         * associated with them. This should always be parallel with sockets.
         */
        this.players = new Map();
        this.turn = 0;
        this.lastCard = null;
    }

    static create() {
        return new GameServer();
    }

    addNewPlayer(name, socket) {
        this.clients.set(socket.id, socket);
        this.players.set(socket.id, Player.create(name, socket.id));
    }

    removePlayer(socketID) {
        if (this.clients.has(socketID)) {
            this.clients.delete(socketID);
        }
        if (this.players.has(socketID)) {
            const player = this.players.get(socketID);
            this.players.delete(socketID);
            return player.name;
        }
    }

    getPlayerNameBySocketId(socketID) {
        if (this.players.has(socketID)) {
            return this.players.get(socketID).name;
        }
    }

    getState() {}

    sendState() {
        const players = [...this.players.cards.length];
        this.clients.forEach((client, socketID) => {
            const currentPlayer = this.players.get(socketID).cards;
            this.clients.get(socketID).emit(Constants.SOCKET_UPDATE, {
                cards: currentPlayer,
                playersCards: players,
                lastCard: this.lastCard,
                turn: this.turn,
            });
        });
    }
}

modules.export = GameServer;
