import React, {useEffect, useMemo, useState} from 'react';
import CellComponent from "./CellComponent";

const BoardComponent = ({board, setBoard, currentPlayer, swapPlayers, endGame, name, firstPlayer, secondPlayer, isBot, postBoard, highlight}) => {
    const [selectedCell, setSelectedCell] = useState(null);
    const [cellsToChoose, setCellsToChoose] = useState(0);
    const [endFlag, setEndFlag] = useState(true);
    const [botTurn , setBotTurn] = useState(true);

    function click(cell) {
        console.log("click!");
        if (!isBot) {
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
        } else {
            if(currentPlayer._name === name) {
                if (currentPlayer._isFirstTurn === true) {
                    if (cell?._figure !== null && cell._figure?._color === currentPlayer?._color && cell._available === true) {
                        cell.deleteFigure();
                        currentPlayer._isFirstTurn = false;
                        swapPlayers();
                    }
                }
                if (selectedCell && selectedCell === cell) {
                    setSelectedCell(null);
                    setCellsToChoose(cellsToChoose % 2 === 0 ? cellsToChoose + 1 : cellsToChoose - 1);
                }
                if (selectedCell && selectedCell !== cell && selectedCell?._figure?.canMove(cell)) {
                    selectedCell.moveFigure(cell);
                    setSelectedCell(null);
                    swapPlayers();
                }
                if (!selectedCell && cell?._figure !== null && cell._figure?._color === currentPlayer?._color) {
                    setSelectedCell(cell);
                }
            }
        }
    }

    function getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    
    function botMakeTurn() {
        if (currentPlayer._isBot === true) {
            setCellsToChoose(cellsToChoose % 2 === 0 ? cellsToChoose + 1 : cellsToChoose - 1);
            if (currentPlayer._isFirstTurn === true) {
                setTimeout(function() {
                    let cells = [];
                    for (let i = 0; i < board._size; ++i) {
                        for (let j = 0; j < board._size; ++j) {
                            if (board.getCell(j, i)._available === true) {
                                cells.push(board.getCell(j, i));
                            }
                        }
                    }
                    if (cells.length > 0) {
                        cells[getRandomInt(1, cells.length) - 1].deleteFigure();
                        currentPlayer._isFirstTurn = false;
                        swapPlayers();
                        setBotTurn(!botTurn);
                    }
                }, (1000));
            } else {
                setTimeout(function() {
                    let cells = [];
                    for (let i = 0; i < board._size; ++i) {
                        for (let j = 0; j < board._size; ++j) {
                            if (board.getCell(j, i)._available === true) {
                                cells.push(board.getCell(j, i));
                            }
                        }
                    }
                    let cell = cells[getRandomInt(1, cells.length) - 1];
                    cells = [];
                    for (let i = 0; i < board._size; ++i) {
                        for (let j = 0; j < board._size; ++j) {
                            if (cell?._figure?.canMove(board.getCell(j, i))) {
                                cells.push(board.getCell(j, i));
                            }
                        }
                    }
                    swapPlayers();
                    cell.moveFigure(cells[getRandomInt(1, cells.length) - 1]);
                    setBotTurn(!botTurn);
                }, (1000));
            }
        }
    }

    useEffect(() => {
        botMakeTurn();
    }, [currentPlayer]);

    useEffect(() => {
        highlightCellsToChoose();
    }, [botTurn]);
    

    function highlightCellsToChoose() {
        if (typeof board.highlightCellsToChoose === 'function') {
            console.log("highlight cells");
            let flag = board.highlightCellsToChoose(currentPlayer);
            if (flag && endFlag) {
                if (typeof endGame === 'function') {
                    setEndFlag(false);
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