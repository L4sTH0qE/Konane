import React, {useEffect, useState} from 'react';
import CellComponent from "./CellComponent";
import {Colors} from "../models/Colors";
import logo_white from "../assets/checkers_top_white.png"
import logo_black from "../assets/checkers_top_black.png"

const BoardComponent = ({board, setBoard, currentPlayer, swapPlayers}) => {
    const [selectedCell, setSelectedCell] = useState(null);
    
    function click(cell) {
        if (selectedCell && selectedCell !== cell && selectedCell?._figure?.canMove(cell)) {
            swapPlayers();
            selectedCell.moveFigure(cell);
            setSelectedCell(null);
        } else {
            if (cell?._figure !== null && cell._figure?._color === currentPlayer?._color) {
                setSelectedCell(cell);
            }
        }
    }
    
    function highlightCells() {
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
        highlightCells();
    }, [selectedCell]);
    
    return (
        <div>
            <h3 className="player-turn">Current player: {currentPlayer._color === Colors.WHITE ? <img src={logo_white} alt="white"/> : <img src={logo_black} alt="black"/>}</h3>
            <div className="board8">
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