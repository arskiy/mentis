class Player {
    constructor(name, socketID, order) {
        this.name = name;
        this.socketID = socketID;
        this.order = order;

        this.cards = [];
        this.isTurn = false;
    }

    static create(name, socketID, order) {
        const player = new Player(name, socketID, order);
        return player;
    }

    initCards(remainingCards, numPlayers) {
        let cards = [];

        for (let i = 0; i < remainingCards.length / numPlayers; ++i) {
            let j = Math.floor(Math.random() * arr.length);

            cards.push(remainingCards.splice(j, 1)[0]);
        }

        this.cards = cards;
        return remainingCards;
    }
}

module.exports = Player;
