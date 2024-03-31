import React, {useEffect, useMemo, useState} from 'react';
import CellComponent from "./CellComponent";
import {Colors} from "../../models/Colors";
import logo_white from "../../assets/checkers_top_white.png"
import logo_black from "../../assets/checkers_top_black.png"
import {Card, CardContent, Typography} from "@mui/material";

const BoardComponent = ({board, setBoard, currentPlayer, swapPlayers, endGame, name, firstPlayer, secondPlayer, postBoard, highlight}) => {
    const [selectedCell, setSelectedCell] = useState(null);
    const [cellsToChoose, setCellsToChoose] = useState(0);

    function click(cell) {
        console.log("click!");
        if(currentPlayer._name === name && firstPlayer !== "" && secondPlayer !== "") {
            if (currentPlayer._isFirstTurn === true) {
                if (cell?._figure !== null && cell._figure?._color === currentPlayer?._color && cell._available === true) {
                    cell.deleteFigure();
                    currentPlayer._isFirstTurn = false;
                    swapPlayers();
                    postBoard(true);
                }
            }
            if (selectedCell && selectedCell === cell) {
                setSelectedCell(null);
                setCellsToChoose(cellsToChoose % 2 === 0 ? cellsToChoose + 1 : cellsToChoose - 1);
                postBoard(false);
            }
            if (selectedCell && selectedCell !== cell && selectedCell?._figure?.canMove(cell)) {
                swapPlayers();
                selectedCell.moveFigure(cell);
                setSelectedCell(null);
                postBoard(true);
            }
            if (!selectedCell && cell?._figure !== null && cell._figure?._color === currentPlayer?._color) {
                setSelectedCell(cell);
                postBoard(false);
            }
        }
    }

    function highlightCellsToChoose() {
        if (typeof board.highlightCellsToChoose === 'function') {
            console.log("component-highlight");
            let flag = board.highlightCellsToChoose(currentPlayer);
            if (flag) {
                if (typeof endGame === 'function') {
                    endGame(currentPlayer);
                }
            } else {
                updateBoard();
            }
        }
    }
    function highlightCellsToMove() {
        if (typeof board.highlightCellsToMove === 'function') {
            board.highlightCellsToMove(selectedCell);
            updateBoard();
        }
    }

    function updateBoard() {
        if (typeof board.getCopyBoard === 'function' && typeof setBoard === 'function') {
            const newBoard = board.getCopyBoard();
            setBoard(newBoard);
        }
    }

    useEffect(() => {
        highlightCellsToMove();
    }, [selectedCell]);

    useEffect(() => {
        if (highlight) {
            try {
                highlightCellsToChoose();
            }
            catch (error) {
                console.log("highlight error");
            }
        }
    }, [highlight]);

    useEffect(() => {
        highlightCellsToChoose();
    }, [cellsToChoose]);

    useMemo(() => {
        while (board === null) {
        }
    }, []);
    
    return (
        <div>
            <div className={board._size === 6 ? "board6" : board._size === 8 ? "board8" : "board10"}>
                {board._cells?.map((row, index) =>
                    <React.Fragment key={index}>
                        {row.map(cell =>
                            <CellComponent
                                click={click}
                                cell={cell}
                                key={board._size * cell._y + cell._x}
                                selected={cell._x === selectedCell?._x && cell._y === selectedCell?._y}
                            />
                        )}
                    </React.Fragment>
                )}
            </div>
        </div>
    );
};

export default BoardComponent;