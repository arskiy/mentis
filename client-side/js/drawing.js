const Constants = require("./constants.js");

class Drawing {
    constructor(context, images) {
        this.context = context;
        this.images = images;

        this.width = context.canvas.width;
        this.height = context.canvas.height;
    }

    static create(canvas) {
        const context = canvas.getContext("2d");
        const images = {};
        for (const card of Constants.DRAWING_IMG_CARDS) {
            images[card] = new Image();
            images[card].src = `${Constants.DRAWING_IMG_BASE_PATH}/${card}.png`;
        }
        for (const back of Constants.DRAWING_IMG_BACK_COLOR) {
            images[back] = new Image();
            images[back].src = `${Constants.DRAWING_IMG_BASE_PATH}/${back}.png`;
        }
        return new Drawing(context, images);
    }

    /**
     * Clears the canvas.
     */
    clear() {
        this.context.clearRect(0, 0, this.width, this.height);
    }

    drawBackground() {}

    drawFrontCards(cards) {
        for (let i = 0; i < cards.length; ++i) {
            let card = this.images[cards[i]];

            let height = 360;
            let heightMultiplier = Math.floor(i / 15);

            height -= 30 * heightMultiplier;
            let width =
                (i - heightMultiplier) * constants.DRAWING_CARD_WIDTH +
                constants.DRAWING_BASE_WIDTH;

            this.context.drawImage(card, width, height);
        }
    }

    getFrontCardIndex(cards, mouseX, mouseY) {
        let width =
            (mouseX - 10 - constants.DRAWING_BASE_WIDTH) /
            constants.DRAWING_CARD_WIDTH;

        if (cards.length > 15) {
            width =
                (mouseX - 10 - constants.DRAWING_BASE_WIDTH) /
                constants.DRAWING_CARD_WIDTH;
        } else if (cards.length > 30) {
            width =
                (mouseX - 20 - constants.DRAWING_BASE_WIDTH) /
                constants.DRAWING_CARD_WIDTH;
        } else {
            width =
                (mouseX - 30 - constants.DRAWING_BASE_WIDTH) /
                constants.DRAWING_CARD_WIDTH;
        }
    }

    drawBackCards(cards) {}

    drawDiscardedCard(lastCard) {}
}

module.exports = Drawing;
