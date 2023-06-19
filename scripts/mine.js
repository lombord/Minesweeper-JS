import { BaseCell } from "./base_cell.js";
import { Cell } from "./cell.js";

/**
 * Class for representing mines
 * @extends BaseCell
 */
class Mine extends BaseCell {
  /**
   * Overrides and extends parent constructor
   * @summary calls 'markCells' method
   */
  constructor(x, y, field) {
    super(x, y, field);
    this.markCells();
  }

  /**
   * Increases mine counter of neighbor
   */
  markCells() {
    for (let cell of this.getNeighbors()) {
      cell instanceof Cell && cell.mines++;
    }
  }

  /**
   * Overrides and extends parent method
   */
  setElm(elm) {
    super.setElm(elm);
    elm.classList.add("mine");
    this.elm.innerHTML = `<img src="col-icons/mine.png" alt="">`;
  }

  /**
   * Reveals itself
   */
  reveal() {
    super.open();
  }

  /**
   * Overrides and extends parent method
   * @summary marks origin mine cell and gives a signal to field to stop the game
   * @param {Event} ev - event object
   */
  open(ev) {
    this.elm.innerHTML = `<img src="col-icons/origin-mine.png" alt="">`;
    super.open();
    this.field.loseGame();
    ev.stopPropagation();
  }
}

export { Mine };
