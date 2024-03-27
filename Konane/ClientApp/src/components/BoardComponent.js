import React, {useEffect, useState} from 'react';
import CellComponent from "./CellComponent";
import {Colors} from "../models/Colors";
import logo_white from "../assets/checkers_top_white.png"
import logo_black from "../assets/checkers_top_black.png"

const BoardComponent = ({board, setBoard, currentPlayer, swapPlayers, endGame}) => {
    const [selectedCell, setSelectedCell] = useState(null);
    const [cellsToChoose, setCellsToChoose] = useState(0);
    
    function click(cell) {
        if (currentPlayer._isFirstTurn === true) {
            if (cell?._figure !== null && cell._figure?._color === currentPlayer?._color && cell._available === true) {
                cell.deleteFigure();
                currentPlayer._isFirstTurn = false;
                swapPlayers();
                setCellsToChoose(cellsToChoose % 2 === 0 ? cellsToChoose+ 1 : cellsToChoose - 1);
            }
        }
        if (selectedCell && selectedCell === cell) {
            setSelectedCell(null);
            setCellsToChoose(cellsToChoose % 2 === 0 ? cellsToChoose+ 1 : cellsToChoose - 1);
        }
        if (selectedCell && selectedCell !== cell && selectedCell?._figure?.canMove(cell)) {
            swapPlayers();
            selectedCell.moveFigure(cell);
            setSelectedCell(null);
            setCellsToChoose(cellsToChoose % 2 === 0 ? cellsToChoose+ 1 : cellsToChoose - 1);
        }
        if (!selectedCell && cell?._figure !== null && cell._figure?._color === currentPlayer?._color) {
            setSelectedCell(cell);
        }
    }
    
    function highlightCellsToChoose() {
        if (typeof board.highlightCellsToChoose === 'function') {
            
            let flag = board.highlightCellsToChoose(currentPlayer);
            updateBoard();
            if (flag) {
                if (typeof endGame === 'function') {
                    endGame(currentPlayer);
                }
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
        highlightCellsToChoose();
    }, [cellsToChoose]);
    
    return (
        <div>
            <h3 className="player-turn">Current player: {'\u00A0'} {currentPlayer._color === Colors.WHITE ? <img src={logo_white} alt="white"/> : <img src={logo_black} alt="black"/>}</h3>
            <div className={board._size === 6 ? "board6" : board._size === 8 ? "board8" : "board10"}>
                {board._cells?.map((row, index) =>
                    <React.Fragment key={index}>
                        {row.map(cell =>
                            <CellComponent
                                click={click}
                                cell={cell}
                                key={cell._id}
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