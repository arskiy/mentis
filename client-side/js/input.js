class Input {
    constructor() {
        this.mouseDown = false;

        this.mouseX = 0;
        this.mouseY = 0;
    }

    static create(keyElement, mouseMoveElement) {
        const input = new Input();
        input.applyEventHandlers(keyElement, mouseMoveElement);
        return input;
    }

    applyEventHandlers(mouseClickElement, mouseMoveElement) {
        mouseClickElement.addEventListener(
            "mousedown",
            this.onMouseDown.bind(this)
        );
        mouseClickElement.addEventListener(
            "mouseup",
            this.onMouseUp.bind(this)
        );
        mouseMoveElement.setAttribute("tabindex", 1);
        mouseMoveElement.addEventListener(
            "mousemove",
            this.onMouseMove.bind(this)
        );
    }

    onMouseDown(event) {
        if (event.which === 1) {
            this.mouseDown = true;
        }
    }

    onMouseUp(event) {
        if (event.which === 1) {
            this.mouseDown = false;
        }
    }

    onMouseMove(event) {
        this.mouseX = event.offsetX;
        this.mouseY = event.offsetY;
    }
}

module.exports = Input;
