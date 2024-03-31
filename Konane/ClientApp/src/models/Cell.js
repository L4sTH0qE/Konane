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
    }

    isEmpty() {
        return this._figure === null;
    }

    isEnemy(target) {
        if (target._figure) {
            return this._figure?._color !== target._figure._color;
        }
        return false;
    }

    isEmptyVertical(target) {
        if (this._x !== target._x) {
            return false;
        }
        const min = Math.min(this._y, target._y);
        const max = Math.max(this._y, target._y);
        if ((max - min) % 2 === 1) {
            return false;
        }
        let counter = 0;
        for (let y = min + 1; y < max; ++y) {
            if ((counter % 2) === 0) {
                if (!this.isEnemy(this._board.getCell(this._x, y))) {
                    return false;
                }
            } else {
                if (!this._board.getCell(this._x, y).isEmpty()) {
                    return false;
                }
            }
            ++counter;
        }
        return true;
    }

    isEmptyHorizontal(target) {
        if (this._y !== target._y) {
            return false;
        }

        const min = Math.min(this._x, target._x);
        const max = Math.max(this._x, target._x);
        if ((max - min) % 2 === 1) {
            return false;
        }
        let counter = 0;
        for (let x = min + 1; x < max; ++x) {
            if ((counter % 2) === 0) {
                if (!this.isEnemy(this._board.getCell(x, this._y))) {
                    return false;
                }
            } else {
                if (!this._board.getCell(x, this._y).isEmpty()) {
                    return false;
                }
            }
            ++counter;
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
            let min = Math.min(this._x, target._x);
            let max = Math.max(this._x, target._x);
            for (let x = min + 1; x < max; ++x) {
                if (!this._board.getCell(x, this._y).isEmpty()) {
                    this._board.getCell(x, this._y).deleteFigure();
                }
            }
            min = Math.min(this._y, target._y);
            max = Math.max(this._y, target._y);
            for (let y = min + 1; y < max; ++y) {
                if (!this._board.getCell(this._x, y).isEmpty()) {
                    this._board.getCell(this._x, y).deleteFigure();
                }
            }
        }
    }

    deleteFigure() {
        this._figure._cell = null;
        this._figure = null;
    }
}