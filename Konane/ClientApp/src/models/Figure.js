import {Colors} from "./Colors"
export class Figure {
    constructor(color, cell)
    {
        this._logo = false;
        this._color = color;
        if (this._color === Colors.WHITE || this._color === Colors.BLACK) {
            this._logo = true;
        }
        this._cell = cell;
        this._cell._figure = this;
    }

    canMove(target) {
        if (target._figure !== null) {
            return false;
        }
        if (this._cell.isEmptyVertical(target)) {
            return true;
        }
        if (this._cell.isEmptyHorizontal(target)) {
            return true;
        }
        return false;
    }
}