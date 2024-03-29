import { Cell } from "./cell.js";
import { Mine } from "./mine.js";

/**
 * Class representing field of the game
 */
class Field {
  /**
   * Creates field by given 'width', 'height', 'mines'.
   * @summary initializes settings and starts the game
   * @param {number} width - width of a field
   * @param {number} height - height of a field
   * @param {number} mines - number of mines
   */
  constructor(width, height, mines) {
    this.setElements();
    this.setSettings(width, height, mines);
  }

  /**
   * Sets the settings of the field
   * @summary sets the settings by given 'width', 'height', 'mines
   * @param {number} width - width of a field
   * @param {number} height - height of a field
   * @param {number} mines - number of mines
   */
  setSettings(width, height, mines) {
    this.W = Math.min(Number(width), 100);
    this.H = Math.min(Number(height), 100);
    this.minesL = Math.min(Number(mines), this.W * this.H, 999);
    this.winCount = this.W * this.H - this.minesL;
    // setup elements' settings
    this.fieldElm.style.gridTemplateColumns = `repeat(${this.W}, 4em)`;

    this.startNewGame();
  }

  /**
   * Gets and Se all html elements related with field
   */
  setElements() {
    this.fieldElm = document.getElementById("gameField");
    this.markElm = document.getElementById("markElm");
    this.timeElm = document.getElementById("timeElm");
    this.resetBtn = document.getElementById("restartBtn");
    this.resetBtn.onclick = () => this.startNewGame();
  }

  /**
   * Resets field state,clears field and starts new game
   */
  startNewGame() {
    this.field = [];
    this.playing = true;
    this.openedCount = 0;
    this.clearFieldElms();
    this.fillField();
    this.createMines();
    this.createElements();
    this.setTimer();
  }

  /**
   * Clears HTMLElement of a field
   */
  clearFieldElms() {
    this.resetBtn.classList.remove("win-btn");
    this.resetBtn.classList.remove("lose-btn");
    this.fieldElm.innerHTML = "";
    this.fieldElm.classList.remove("game-over");
  }

  /**
   * Fills a field with new cells
   */
  fillField() {
    for (let y = 0; y < this.H; y++) {
      const row = [];
      this.field[y] = row;
      for (let x = 0; x < this.W; x++) row.push(new Cell(x, y, this));
    }
  }

  /**
   * Creates mines in random positions
   */
  createMines() {
    this.mines = new Array(this.minesL);
    this.markCount = this.minesL;
    for (let i = 0; i < this.minesL; i++) {
      let x, y;
      do {
        [x, y] = this.getRandCell();
      } while (this.field[y][x] instanceof Mine);
      this.field[y][x] = new Mine(x, y, this);
      this.mines.push(this.field[y][x]);
    }
  }

  /**
   * Creates HTMLElement for each cell
   */
  createElements() {
    this.field.forEach((row) =>
      row.forEach((cell) => {
        const elm = document.createElement("div");
        this.fieldElm.appendChild(elm);
        cell.setElm(elm);
      })
    );
  }

  /**
   * Sets a timer
   */
  setTimer() {
    this.seconds = 0;
    this.stopTimer();
    this.fieldElm.addEventListener(
      "click",
      () => {
        if (this.playing) {
          this.timeID = setInterval(() => this.seconds++, 1000);
        }
      },
      { once: true }
    );
  }

  /**
   * Stops a timer
   */
  stopTimer() {
    this.timeID = null;
  }

  /**
   * Adds given val to mark counter
   * @param {number} val - val to add mark counter
   */
  changeMark(val) {
    this.markCount += val;
  }

  /**
   * Checks if player win the game, if so 'winGame' is called
   */
  checkWin() {
    ++this.openedCount == this.winCount && this.winGame();
  }

  /**
   * Wins the game and calls 'endGame'
   */
  winGame() {
    this.mines.forEach(
      (c) => !c.marked && c.elm.dispatchEvent(new Event("contextmenu"))
    );
    this.resetBtn.classList.add("win-btn");
    this.fieldElm.setAttribute("winText", "Win");
    this.endGame();
  }

  /**
   * Losses the game and calls 'endGame'
   */
  loseGame() {
    this.mines.forEach((m) => m.reveal());
    this.resetBtn.classList.add("lose-btn");
    this.fieldElm.setAttribute("winText", "Lose");
    this.endGame();
  }

  /**
   * Ends the game
   */
  endGame() {
    this.playing = false;
    this.stopTimer();
    this.fieldElm.classList.add("game-over");
  }

  /**
   * Gives random coordinates for a cell
   * @return {number[]} random (x,y) axises
   */
  getRandCell() {
    return [
      Math.floor(Math.random() * this.W),
      Math.floor(Math.random() * this.H),
    ];
  }

  /**
   * getter for markCount
   * @return {number}
   */
  get markCount() {
    return this._markCount;
  }

  /**
   * Sets new mark count for both property and HTMLElement
   * @param {number} val - new mark count value
   */
  set markCount(val) {
    this._markCount = val;
    this.markElm.innerText = `${this.markCount}`.padStart(3, "0");
  }

  /**
   * getter for seconds
   * @return {number}
   */
  get seconds() {
    return this._seconds;
  }

  /**
   * Sets new seconds for both property and HTMLElement
   * @param {number} sec - new seconds value
   */
  set seconds(sec) {
    if (sec >= 1000) {
      this.loseGame();
      sec = 999;
    }
    this._seconds = sec;
    this.timeElm.innerText = `${sec}`.padStart(3, "0");
  }

  /**
   * getter for timeID
   * @summary this property represents id of the current serInterval
   * @return {number}
   */
  get timeID() {
    return this._timeID;
  }

  /**
   * Clears old serInterval and stores new intervals id
   * @param {number} id - new id of setInterval
   */
  set timeID(id) {
    clearInterval(this._timeID);
    this._timeID = id;
  }
}

export { Field };
