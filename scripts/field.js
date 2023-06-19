import { Cell } from "./cell.js";
import { Mine } from "./mine.js";

class Field {
  constructor(width, height, mines) {
    this.setSettings(width, height, mines);
    this.setElements();
    this.startNewGame();
  }

  setSettings(width, height, mines) {
    this.W = width;
    this.H = height;
    this.minesL = mines;
    this.winCount = this.W * this.H - this.minesL;
  }

  setElements() {
    this.fieldElm = document.getElementById("gameField");
    this.markElm = document.getElementById("markElm");
    this.timeElm = document.getElementById("timeElm");
    this.resetBtn = document.getElementById("restartBtn");
    this.resetBtn.onclick = () => this.startNewGame();
  }

  startNewGame() {
    this.field = [];
    this.openedCount = 0;
    this.clearFieldElm();
    this.fillField();
    this.createMines();
    this.createElements();
    this.setTimer();
  }

  clearFieldElm() {
    this.fieldElm.innerHTML = "";
    this.fieldElm.classList.remove("game-over");
  }

  fillField() {
    for (let y = 0; y < this.H; y++) {
      const row = [];
      this.field[y] = row;
      for (let x = 0; x < this.W; x++) row.push(new Cell(x, y, this));
    }
  }

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

  createElements() {
    this.field.forEach((row) =>
      row.forEach((cell) => {
        const elm = document.createElement("div");
        this.fieldElm.appendChild(elm);
        cell.setElm(elm);
      })
    );
  }

  setTimer() {
    this.seconds = 0;
    this.stopTimer();
    this.fieldElm.addEventListener(
      "click",
      () => {
        this.timeID = setInterval(() => this.seconds++, 1000);
      },
      { once: true }
    );
  }

  stopTimer() {
    this.timeID = null;
  }

  changeMark(val) {
    this.markCount += val;
  }

  checkWin() {
    ++this.openedCount == this.winCount && this.winGame();
  }

  winGame() {
    this.mines.forEach(
      (c) => !c.marked && c.elm.dispatchEvent(new Event("contextmenu"))
    );
    this.resetBtn.classList.add("win-btn");
    this.resetBtn.addEventListener(
      "click",
      () => this.resetBtn.classList.remove("win-btn"),
      { once: true }
    );
    this.endGame();
  }

  loseGame() {
    this.mines.forEach((m) => m.reveal());
    this.resetBtn.classList.add("lose-btn");
    this.resetBtn.addEventListener(
      "click",
      () => this.resetBtn.classList.remove("lose-btn"),
      { once: true }
    );
    this.endGame();
  }

  endGame() {
    this.stopTimer();
    this.fieldElm.classList.add("game-over");
  }

  getRandCell() {
    return [
      Math.floor(Math.random() * this.W),
      Math.floor(Math.random() * this.H),
    ];
  }

  get markCount() {
    return this._markCount;
  }

  set markCount(val) {
    this._markCount = val;
    this.markElm.innerText = `${this.markCount}`.padStart(3, "0");
  }

  get seconds() {
    return this._seconds;
  }

  set seconds(sec) {
    this._seconds = sec;
    this.timeElm.innerText = `${sec}`.padStart(3, "0");
  }

  get timeID() {
    return this._timeID;
  }

  set timeID(id) {
    clearInterval(this._timeID);
    this._timeID = id;
  }
}

export { Field };
