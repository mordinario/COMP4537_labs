const colors = ["red", "cyan", "yellow", "green", "aquamarine", "pink", "bisque"];

// Game button
class Button {
    constructor(color, order) {
        // console.log({color: color, order: order})
        this.order = order;
        this.createDOMButton(color, order);
    }

    createDOMButton(color, order) {
        this.btn = document.createElement("button");
        this.btn.style.backgroundColor = color;
        this.btn.innerText = order;
        this.btn.classList += "gameButton";
        document.getElementById("gameArea").appendChild(this.btn);
    }
    
    changePosition() {
        // console.log("position changing!");
        let upperYBound = 100;
        let lowerYBound = window.innerHeight - 400;
        let upperXBound = 100;
        let lowerXBound = window.innerWidth - 300;
        let yPosPx = upperYBound + Math.random() * lowerYBound;
        let xPosPx = upperXBound + Math.random() * lowerXBound;

        this.btn.style.top = "" + yPosPx + "px";
        this.btn.style.left = "" + xPosPx + "px";
    }

    hideText() {
        this.btn.innerText = "";
    }

    showText() {
        this.btn.innerText = this.order;
    }
}

// Contains the buttons and manages the button positions/functionality
class GameArea {
    constructor(buttonAmount, gameLogicManager) {
        this.clearGameAreaDiv();
        this.shuffleColors();
        this.btnArr = this.createButtons(buttonAmount);
        this.gameLogicManager = gameLogicManager;
    }

    clearGameAreaDiv() {
        document.getElementById("gameArea").innerHTML = "";
    }

    shuffleColors() {
        // fisher-yates
        for(let i = colors.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            [colors[i], colors[j]] = [colors[j], colors[i]] // destructuring is awesome
        }
    }

    createButtons(buttonAmount) {
        let btnArray = [];
        for(let i = 0; i < buttonAmount; i++)
        {
            // console.log(i);
            btnArray.push(new Button(colors[i], i + 1));
        }
        return btnArray;
    }

    // requires positions fixed
    shuffleButtons() {
        this.btnArr.forEach(btn => {
            btn.btn.style.position = "fixed";
            btn.changePosition();
        })
    }

    alignButtons() {
        this.btnArr.forEach(btn => {
            btn.btn.style.position = "static";
        })
    }

    // turn on clicking functionality
    turnOnClickable() {
        this.btnArr.forEach(btn => {
            btn.btn.style.cursor = "pointer";
            btn.btn.onclick = () => {
                this.gameLogicManager.manageClick(btn);
            }
        })
    }

    // turn off clicking functionality
    turnOffClickable() {
        this.btnArr.forEach(btn => {
            btn.btn.style.cursor = "revert";
            btn.btn.onclick = () => {};
        })
    }

    // hide all button text
    hideButtonText() {
        this.btnArr.forEach(btn => {btn.hideText()})
    }

    // show all button text
    showButtonText() {
        this.btnArr.forEach(btn => {btn.showText()})
    }
}

// Manages the logic of the game (input validation, order pressing, etc)
class GameLogicManager {
    constructor() {
        this.count = 0;
        this.btnAmt = 0;
    }

    validateInput() {
        let buttonAmount = parseInt(document.getElementById("buttonNum").value);
        if(isNaN(buttonAmount))
        {
            console.log("Not a number!");
            return;
        }

        if(buttonAmount < 3 || buttonAmount > 7)
        {
            console.log("Out of bounds!");
            return;
        }

        return buttonAmount;
    }

    startGame() {
        StringHandler.clearMessage();
        this.btnAmt = this.validateInput();
        this.gameArea = new GameArea(this.btnAmt, this);
        this.gameArea.turnOffClickable();
        setTimeout(() => {
            // hide order
            this.gameArea.hideButtonText();

            // shuffle three times
            this.gameArea.shuffleButtons(); // ugly but w/e
            let buttonShuffleID = setInterval(() => {
                this.gameArea.shuffleButtons()
            }, 2000);

            setTimeout(() => {
                clearInterval(buttonShuffleID);
                this.gameArea.turnOnClickable();
            }, 6000);

        }, this.btnAmt * 1000);
    }

    manageClick(btn) {
        console.log({count: this.count, order: btn.order})
        if(btn.order != this.count + 1) {
            this.gameArea.showButtonText();
            this.gameArea.turnOffClickable();
            StringHandler.displayLossMessage();
            return;
        }

        btn.showText();
        this.count++;
        if(this.btnAmt == this.count) {
            StringHandler.displayWinMessage();
            this.gameArea.turnOffClickable();
        }
    }
}

class StringHandler {
    static displayEntryMessages() {
        document.getElementById("entryMessage").innerText = BUTTON_AMT_PROMPT;
        document.getElementById("startButton").innerText = GAME_START_PROMPT;
    }

    static clearMessage() {
        document.getElementById("message").innerText = "";
    }

    static displayWinMessage() {
        document.getElementById("message").innerText = WIN_MESSAGE;
    }

    static displayLossMessage() {
        document.getElementById("message").innerText = LOSS_MESSAGE;
    }
}

StringHandler.displayEntryMessages();