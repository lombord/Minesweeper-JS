class BaseCell {
  constructor(x, y, field) {
    this.x = x;
    this.y = y;
    this.field = field;
    this.marked = false;
    this.ogOpen = this.open;
    this.open = this.checkMarked;
    this.neighborCords = Array.from(this.getNeighborCords());
  }

  setElm(elm) {
    this.elm = elm;
    this.elm.onclick = (ev) => this.open(ev);
    this.elm.oncontextmenu = () => {
      this.marked = this.elm.classList.toggle("marked");
      this.field.changeMark(-this.marked || 1);
      return false;
    };
  }

  get field() {
    return this._field.deref();
  }

  set field(field) {
    this._field = new WeakRef(field);
  }

  checkMarked(...args) {
    if (!this.marked) return this.ogOpen(...args);
  }

  open() {
    this.elm.classList.add("opened");
    this.elm.oncontextmenu = () => false;
    this.open = this.ogOpen;
  }

  *getNeighborCords() {
    const [bX, bY] = [this.x - 1, this.y - 1];
    for (let y = bY; y < Math.min(bY + 3, this.field.H); y++) {
      for (let x = bX; x < Math.min(bX + 3, this.field.W); x++) {
        if (x >= 0 && y >= 0 && !(this.x == x && this.y == y)) yield [y, x];
      }
    }
  }
  *getNeighbors() {
    for (let [y, x] of this.neighborCords) yield this.field.field[y][x];
  }
}

class Cell extends BaseCell {
  constructor(x, y, field) {
    super(x, y, field);
    this.mines = 0;
    this.opened = false;
  }

  setElm(elm) {
    super.setElm(elm);
    this.elm.innerHTML = `${this.mines || "&nbsp"}`;
    elm.classList.add(`col-${this.mines}`);
  }

  open2() {
    let count = 0;
    for (let cell of this.getNeighbors()) count += cell.marked;
    count >= this.mines && this.openNeighbors();
  }

  activeNeighbors(met) {
    for (let cell of this.getNeighbors()) {
      cell.elm.classList[met]("activated");
    }
  }

  open() {
    if (this.opened) return;
    super.open();
    this.elm.classList.add("cell-opened");
    this.opened = true;
    this.field.checkWin();
    if (!this.mines) {
      this.openNeighbors();
    } else {
      this.open = this.open2;
      this.elm.onmousedown = () => this.activeNeighbors("add");
      this.elm.onmouseup = this.elm.onmouseout = () =>
        this.activeNeighbors("remove");
    }
  }

  openNeighbors() {
    for (let cell of this.getNeighbors()) if (!cell.opened) cell.open();
  }
}

class Mine extends BaseCell {
  constructor(x, y, field) {
    super(x, y, field);
    this.markCells();
  }

  markCells() {
    for (let cell of this.getNeighbors()) {
      cell instanceof Cell && cell.mines++;
    }
  }

  setElm(elm) {
    super.setElm(elm);
    elm.classList.add("mine");
    this.elm.innerHTML = `<img src="col-icons/mine.png" alt="">`;
  }

  reveal() {
    super.open();
  }

  open(ev) {
    this.elm.innerHTML = `<img src="col-icons/origin-mine.png" alt="">`;
    super.open();
    this.field.loseGame();
    ev.stopPropagation();
  }
}

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
    this.endGame();
  }

  loseGame() {
    this.mines.forEach((m) => m.reveal());
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

function main() {
  const field = new Field(9, 9, 10);
}

main();
