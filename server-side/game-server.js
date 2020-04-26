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

        /**
         * This is a Map containing the players' order of playing.
         */
        this.numberOfPlayers = 0;
        this.playerNames = [];

        this.turn = 0;
        this.lastCard = null;
        this.discardedCards = [];
    }

    static create() {
        return new GameServer();
    }

    addNewPlayer(name, socket) {
        this.clients.set(socket.id, socket);
        this.players.set(
            socket.id,
            Player.create(name, socket.id, this.numberOfPlayers)
        );
        console.log("creating new player... " + name);

        this.playerNames.push(name);
        console.log(this);
        this.numberOfPlayers += 1;
    }

    sendPlayersNames() {
        for (const soc of this.clients) {
            soc[1].emit("players-online", this.playerNames);
        }
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

    startGame() {
        if (game.players.length > 1 && game.players.length < 6) {
            return true;
        } else {
            return false;
        }
    }

    getPlayerNameBySocketId(socketID) {
        if (this.players.has(socketID)) {
            return this.players.get(socketID).name;
        }
    }

    getPlayerOrder(socketID) {
        if (this.players.has(socketID)) {
            return this.playerOrder.get(socketID).order;
        }
    }

    getState(socketID, data) {
        let player = this.players.get(socketID);
        if (player) {
            // pass turn to next and update
            if (data.isTurn && data.cardPlayed) {
                this.lastCard = data.cardPlayed;
                this.discardedCards.push(this.lastCard);

                player.cards = data.cards;

                player.isTurn = false;

                let order = player.order;

                // last player, so reset to first
                if (order == this.numberOfPlayers - 1) {
                    this.turn = 0;
                    for (const playerIter of this.players) {
                        if (playerIter[1].order == 0) {
                            playerIter[1].isTurn = true;
                        }
                    }
                } else {
                    for (const playerIter of this.players) {
                        if (playerIter[1].order == player.order + 1) {
                            this.turn = playerIter[1].order;
                            playerIter[1].isTurn = true;
                        }
                    }
                }
            }
        }
    }

    sendState() {
        const players = [...this.players.cards.length];
        this.clients.forEach((client, socketID) => {
            const currentPlayer = this.players.get(socketID).cards;
            let turn = false;
            if (currentPlayer.isTurn) {
                turn = true;
            }

            this.clients.get(socketID).emit(Constants.SOCKET_UPDATE, {
                cards: currentPlayer,
                playersCards: players,
                lastCard: this.lastCard,
                isTurn: turn,
            });
        });
    }
}

module.exports = GameServer;
