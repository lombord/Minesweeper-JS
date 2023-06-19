/**
 * Base class for cells
 */
class BaseCell {
  /**
   * Creates a cell with (x, y) coordinates.
   * @param {number} x - 'x' axis of a cell.
   * @param {number} y - 'y' axis of a cell.
   * @param {Field} field - field where cell is created.
   */
  constructor(x, y, field) {
    this.x = x;
    this.y = y;
    this.field = field;
    // marked state property
    this.marked = false;
    this.ogOpen = this.open;
    this.open = this.checkMarked;
    this.neighborCords = Array.from(this.getNeighborCords());
  }

  /**
   * Called when set HTMLElement for an object.
   * @summary Connects 'onclick' and 'contextmenu' methods of the element to arrow function
   * to signal the object is clicked
   * @param {HTMLElement} elm - HTMLElement object that will represent the object
   */
  setElm(elm) {
    this.elm = elm;
    this.elm.onclick = (ev) => this.open(ev);
    this.elm.oncontextmenu = () => {
      this.marked = this.elm.classList.toggle("marked");
      this.field.changeMark(-this.marked || 1);
      return false;
    };
  }

  /**
   * Getter for field WeakRef object
   * @return {Field} ref to field object
   */
  get field() {
    return this._field.deref();
  }

  /**
   * Sets new field WeakRef
   * @param {Field} field - field where cell located .
   */
  set field(field) {
    this._field = new WeakRef(field);
  }

  /**
   * Decorator for open method
   * @summary Checks if cell is marked, and if so open method wont be called
   * @param {Any} args - required args for open method
   */
  checkMarked(...args) {
    if (!this.marked) return this.ogOpen(...args);
  }

  /**
   * Base open method for BaseCell and subclasses
   * @summary called when element is clicked, opens cell and changes element representation
   */
  open() {
    this.elm.classList.add("opened");
    this.elm.oncontextmenu = () => false;
    this.open = this.ogOpen;
  }

  /**
   * Generator to get neighbor cells coordinates based (x, y) axises of cell
   * @summary yields coordinates of neighbor cells
   * @yield {array} (x, y) axises of neighbor cell
   */
  *getNeighborCords() {
    const [bX, bY] = [this.x - 1, this.y - 1];
    for (let y = bY; y < Math.min(bY + 3, this.field.H); y++) {
      for (let x = bX; x < Math.min(bX + 3, this.field.W); x++) {
        if (x >= 0 && y >= 0 && !(this.x == x && this.y == y)) yield [y, x];
      }
    }
  }
  /**
   * Generator to get neighbor cells based on their coordinates
   * @summary yields cell object in each iteration
   * @yield {BaseCell} cell object
   */
  *getNeighbors() {
    for (let [y, x] of this.neighborCords) yield this.field.field[y][x];
  }
}

export { BaseCell };
