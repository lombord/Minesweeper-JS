import { BaseCell } from "./base_cell.js";
import { Cell } from "./cell.js";

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

export { Mine };
