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

export { BaseCell };
