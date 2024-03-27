import React from 'react';
import {Cell} from "./Cell";
import {Colors} from "./Colors";
import {Figure} from "./Figure";

export class Board
{
    constructor(size)
    {
        this._size = size;
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
        const counter = 0;
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
        const counter = 0;
        for (let i = 0; i < this._size; ++i)
        {
            const row = this._cells[i];
            for (let j = 0; j < this._size; ++j)
            {
                const target = row[j];
            }
        }
    }
    
    getCopyBoard() {
        const newBoard = new Board(8);
        newBoard._cells = this._cells;
        newBoard._size = this._size;
        return newBoard;
    }
}