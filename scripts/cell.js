import { BaseCell } from "./base_cell.js";

/**
 * Cell class
 * @extends BaseCell
 */
class Cell extends BaseCell {
  /**
   * Overrides parent constructor and adds
   * 'mines' counter and 'opened' state var.
   */
  constructor(x, y, field) {
    super(x, y, field);
    this.mines = 0;
    this.opened = false;
  }

  /**
   * Overrides parent method and adds specific class for elm
   */
  setElm(elm) {
    super.setElm(elm);
    elm.innerHTML = `${this.mines || "&nbsp"}`;
    elm.classList.add(`col-${this.mines}`);
  }

  /**
   * Overrides main open method after cell opened
   * @summary checks if neighbor cells marked enough,
   * if so calls 'openNeighbors' method
   */
  open2() {
    let count = 0;
    for (let cell of this.getNeighbors()) count += cell.marked;
    count >= this.mines && this.openNeighbors();
  }

  /**
   * Activates or Deactivates neighbor cells when cell clicked
   * @summary Adds or removes 'activated' class of cell.elm depending on 'method_name'
   * @param {string} method_name - method name (exp:'add' or 'remove')
   * @return {ReturnValueDataTypeHere} Brief description of the returning value here.
   */
  activeNeighbors(method_name) {
    for (let cell of this.getNeighbors()) {
      cell.elm.classList[method_name]("activated");
    }
  }

  /**
   * Overrides parent method and extends it
   * @summary Initializes other methods after click
   * and gives a signal to field to check winning!
   */
  open() {
    if (this.opened) return;
    super.open();
    const { elm } = this;
    elm.classList.add("cell-opened");
    this.opened = true;
    this.field.checkWin();
    // if empty cell then open neighbors
    if (!this.mines) {
      this.openNeighbors();
    } else {
      this.open = this.open2;
      elm.onmousedown = () => this.activeNeighbors("add");
      elm.onmouseup = elm.onmouseout = () => this.activeNeighbors("remove");
    }
  }

  /**
   * Opens neighbor cells if it's not opened already
   */
  openNeighbors() {
    for (let cell of this.getNeighbors()) if (!cell.opened) cell.open();
  }
}

export { Cell };
