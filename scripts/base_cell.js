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
    // coordinates
    this.x = x;
    this.y = y;
    this.field = field;

    // setup border coordinate ranges
    const { min, max } = Math;
    const [bX, bY] = [x - 1, y - 1];
    [this.yStart, this.yStop] = [max(bY, 0), min(bY + 3, field.H)];
    [this.xStart, this.xStop] = [max(bX, 0), min(bX + 3, field.W)];

    // marked flag
    this.marked = false;
    // open methods
    this.ogOpen = this.open;
    this.open = this.checkMarked;
  }

  /**
   * Called when set HTMLElement for an object.
   * @summary Connects 'onclick' and 'contextmenu' methods of the element to arrow function
   * to signal the object is clicked
   * @param {HTMLElement} elm - HTMLElement object that will represent the object
   */
  setElm(elm) {
    this.elm = elm;
    elm.onclick = (ev) => this.open(ev);
    elm.oncontextmenu = () => {
      this.marked = elm.classList.toggle("marked");
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
    const { x: cellX, y: cellY, yStart, yStop, xStart, xStop } = this;
    for (let y = yStart; y < yStop; y++) {
      for (let x = xStart; x < xStop; x++) {
        if (!(x == cellX && y == cellY)) yield [y, x];
      }
    }
  }

  /**
   * Generator to get neighbor cells based on their coordinates
   * @summary yields cell object in each iteration
   * @yield {BaseCell} cell object
   */
  *getNeighbors() {
    for (let [y, x] of this.getNeighborCords()) yield this.field.field[y][x];
  }
}

export { BaseCell };
