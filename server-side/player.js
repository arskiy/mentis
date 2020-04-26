class Player {
    constructor(name, socketID) {
        this.name = name;
        this.socketID = socketID;

        this.cards = [];
    }

    static create(name, socketID) {
        const player = new Player(name, socketID);
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
