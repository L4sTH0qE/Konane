import logo_white from "../assets/checkers_top_white.png"
import logo_black from "../assets/checkers_top_black.png"
import {Colors} from "./Colors"
export class Figure
{
    constructor(color, cell)
    {
        this._logo = null;
        this._color = color;
        if (this._color === Colors.WHITE) {
            this._logo = logo_white;
        } else {
            this._logo = logo_black;
        }
        this._cell = cell;
        this._cell._figure = this;
        this._id = Math.random();
        this._isFirstStep = true;
    }
    
    canMove(target) {
        if (target._figure?._color === this._color) {
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
    
    moveFigure(target) {
        this._isFirstStep = false;
    }
    
    
}