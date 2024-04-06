import {Cell} from "./Cell";
import {Colors} from "./Colors";
import {Figure} from "./Figure";

export class Board
{
    constructor(size)
    {
        this._size = size !== null ? size : 8;
        const cells = []
        for (let i = 0; i < size; ++i)
        {
            const row = [];
            for (let j = 0; j < size; ++j)
            {
                if (((i + j) % 2) === 0) {
                    row.push(new Cell(this, j, i, Colors.WHITE, null));
                } else {
                    row.push(new Cell(this, j, i, Colors.BLACK, null));
                }
            }
            cells.push(row);
        }
        this._cells = cells;
    }

    getCell(x, y) {
        return this._cells[y][x];
    }

    addFigures() {
        for (let i = 0; i < this._size; ++i)
        {
            for (let j = 0; j < this._size; ++j)
            {
                if (((i + j) % 2) === 0) {
                    new Figure(Colors.WHITE, this.getCell(j, i));
                } else {
                    new Figure(Colors.BLACK, this.getCell(j, i));
                }
            }
        }
    }

    highlightCellsToMove(selectedCell) {
        for (let i = 0; i < this._size; ++i)
        {
            const row = this._cells[i];
            for (let j = 0; j < this._size; ++j)
            {
                const target = row[j];
                target._available = !!selectedCell?._figure?.canMove(target);
            }
        }
    }

    highlightCellsToChoose(currentPlayer) {
        try {
            for (let k = 0; k < this._size; ++k)
            {
                for (let l = 0; l < this._size; ++l)
                {
                    this.getCell(l, k)._available = false;
                }
            }
            if (currentPlayer._isFirstTurn === true) {
                if (currentPlayer._color === Colors.BLACK) {
                    let coord = (this._size / 2) - 1;
                    this.getCell(coord + 1, coord)._available = true;
                    this.getCell(coord - 1, coord)._available = true;
                    this.getCell(coord, coord + 1)._available = true;
                    this.getCell(coord, coord - 1)._available = true;
                } else {
                    let flag = false;
                    for (let k = 0; k < this._size; ++k)
                    {
                        for (let l = 0; l < this._size; ++l)
                        {
                            if (this.getCell(l, k)?._figure === null) {
                                this.getCell(l + 1, k)._available = true;
                                this.getCell(l - 1, k)._available = true;
                                this.getCell(l, k + 1)._available = true;
                                this.getCell(l, k - 1)._available = true;
                                flag = true;
                                break;
                            }
                        }
                        if (flag) {
                            break;
                        }
                    }
                }
            } else {
                let counter = 0;
                for (let i = 0; i < this._size; ++i)
                {
                    for (let j = 0; j < this._size; ++j)
                    {
                        if (this.getCell(j, i)?._figure !== null && this.getCell(j, i)?._figure._color === currentPlayer._color) {
                            let flag = false;
                            for (let k = 0; k < this._size; ++k)
                            {
                                for (let l = 0; l < this._size; ++l)
                                {
                                    if (!(j === l && i === k)) {
                                        if (!!this.getCell(j, i)?._figure?.canMove(this.getCell(l, k))) {
                                            this.getCell(j, i)._available = true;
                                            ++counter;
                                            flag = true;
                                            break;
                                        }
                                    }
                                }
                                if (flag) {
                                    break;
                                }
                            }
                        }
                    }
                }
                if (counter === 0) {
                    return true;
                }
            }
            return false;
        } catch (error) {
            console.error("Error occured while highlighting");
            return false;
        }
    }

    getCopyBoard() {
        const newBoard = new Board(8);
        newBoard._cells = this._cells;
        newBoard._size = this._size;
        return newBoard;
    }
}