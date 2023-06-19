import { BaseCell } from "./base_cell.js";

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

export { Cell };
