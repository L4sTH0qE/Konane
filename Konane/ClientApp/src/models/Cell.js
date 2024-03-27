import React from 'react';

export class Cell
{
    constructor(board, x, y, color, figure)
    {
        this._color = color;
        this._board = board;
        this._x = x;
        this._y = y;
        this._figure = figure;
        this._available = false;
        this._id = Math.random();
    }
    
    isEmpty() {
        return this._figure === null;
    }
    
    isEmptyVertical(target) {
        if (this._x !== target._x) {
            return false;
        }
        
        const min = Math.min(this._y, target._y);
        const max = Math.max(this._y, target._y);
        
        for (let y = min + 1; y < max; ++y) {
            if (!this._board.getCell(this._x, y).isEmpty()) {
                return false;
            }
        }
        return true;
    }

    isEmptyHorizontal(target) {
        if (this._y !== target._y) {
            return false;
        }

        const min = Math.min(this._x, target._x);
        const max = Math.max(this._x, target._x);

        for (let x = min + 1; x < max; ++x) {
            if (!this._board.getCell(x, this._y).isEmpty()) {
                return false;
            }
        }
        return true;
    }
    
    setFigure(figure) {
        this._figure = figure;
        this._figure._cell = this;
    }
    
    moveFigure(target) {
        if(this._figure && this._figure?.canMove(target)) {
            this._figure.moveFigure(target);
            target.setFigure(this._figure);
            this._figure = null;
        }
    }
}