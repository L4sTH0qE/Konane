import React, {Component, useEffect, useMemo, useState} from 'react';
import BoardComponent from "./BoardComponent";
import {Board} from "../../models/Board";
import {Player} from "../../models/Player";
import {Figure} from "../../models/Figure";
import {Colors} from "../../models/Colors";
import {Navigate} from "react-router-dom";
import {Card, CardContent, Typography} from "@mui/material";
import "./Game.css";
import logo_white from "../../assets/checkers_top_white.png";
import logo_black from "../../assets/checkers_top_black.png";

const flatted = require('flatted');

export default function  Game (props) {
    const [board, setBoard] = useState(null);
    const [whitePlayer, setWhitePlayer] = useState(null);
    const [blackPlayer, setBlackPlayer] = useState(null);
    const [currentPlayer, setCurrentPlayer] = useState(null);
    const [opponent, setOpponent] = useState("");
    const [winner, setWinner] = useState(null);
    const [gameOver, setGameOver] = useState(false);
    const [redirect, setRedirect] = useState(false);
    const [generate, setGenerate] = useState(false);

    useMemo(() => {
        joinRoom(props.roomId);
    }, []);

    useEffect(() => {
        if (generate) {
            createRoom();
        }
    }, [generate]);

    async function createRoom() {
        const newBlackPlayer = new Player (Colors.BLACK);
        const newWhitePlayer = new Player (Colors.WHITE);
        newBlackPlayer._name = props.name;
        newBlackPlayer._isBot = false;
        newWhitePlayer._isBot = props.isBot;
        setBlackPlayer(newBlackPlayer);
        setWhitePlayer(newWhitePlayer);
        setCurrentPlayer(newBlackPlayer);
        const newBoard = new Board(props.size);
        newBoard.addFigures();
        newBoard.highlightCellsToChoose(newBlackPlayer);
        setBoard(newBoard);
        console.log(newBoard);
        await fetch('/room', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ roomId: props.roomId, firstPlayer: newBlackPlayer._name, secondPlayer: newWhitePlayer._name, currentPlayer: newBlackPlayer._name, board: flatted.stringify(newBoard) })
        });
        console.log("CreateRoom");
    }

    function swapPlayers() {
        setCurrentPlayer(currentPlayer._color === Colors.WHITE ? blackPlayer : whitePlayer);
    }

    function endGame(currentPlayer) {
        setWinner(currentPlayer === blackPlayer ? whitePlayer : blackPlayer);
        setGameOver(true);
    }

    async function postRoom(roomId) {
        await fetch('/room', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ roomId: roomId, firstPlayer: blackPlayer._name, secondPlayer: whitePlayer._name, currentPlayer: currentPlayer._name, board: flatted.stringify(board) })
        });
        console.log("RoomPost");
    }

    async function getRoom(roomId) {
        await fetch('/room', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ roomId: roomId, firstPlayer: blackPlayer._name, secondPlayer: whitePlayer._name, currentPlayer: currentPlayer._name, board: flatted.stringify(board) })
        });
        console.log("RoomPost");
    }

    async function joinRoom(roomId) {
        try {
            const response = await fetch('/room/' + roomId);
            const room = await response.json();
            const newBlackPlayer = new Player (Colors.BLACK);
            newBlackPlayer._name = room.firstPlayer;
            newBlackPlayer._isBot = false;
            const newWhitePlayer = new Player (Colors.WHITE);
            newWhitePlayer._isBot = false;
            if (room.secondPlayer === props.name || room.secondPlayer === "") {
                newWhitePlayer._name = props.name;
                setOpponent(room.firstPlayer);
            } else {
                newWhitePlayer._name = room.secondPlayer;
            }
            setBlackPlayer(newBlackPlayer);
            setWhitePlayer(newWhitePlayer);
            
            if (room.currentPlayer === "") {
                setCurrentPlayer(newWhitePlayer);
            } else {
                room.currentPlayer === newBlackPlayer._name ? setCurrentPlayer(newBlackPlayer) : setCurrentPlayer(newWhitePlayer);
            }
            
            const tmp = flatted.parse(room.board);
            const newBoard = new Board (tmp._size);
            for (let i = 0; i < newBoard._size; ++i)
            {
                for (let j = 0; j < newBoard._size; ++j)
                {
                    const cell = tmp._cells[i][j];
                    if (cell._figure !== null) {
                        new Figure(cell._figure._color, newBoard._cells[i][j]);
                    }
                }
            }
            console.log(newBoard);
            setBoard(newBoard);
            console.log("JoinRoom");
            await fetch('/room', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ roomId: roomId, firstPlayer: newBlackPlayer._name, secondPlayer: newWhitePlayer._name, currentPlayer: newBlackPlayer._name, board: flatted.stringify(newBoard) })
            });
            return true;
        } catch (error) {
            setGenerate(true);
            console.error('Failed to fetch data:', error);
            return false;
        }
    }
    
    return (
        <>
            {redirect === true ? <Navigate to='/' replace={true}/> :
                gameOver === true ?             <>
                        <div className="myModal" >
                            <div className="myModalContent">
                                <h3>Game over!<br/> Winner is: {winner._color === Colors.WHITE ? <img src={logo_white} alt="white"/> : <img src={logo_black} alt="black"/>}</h3>
                                <div className="custom">
                                    <button className="btn btn-primary chs-btn-center" onClick={() => setRedirect(true)}>Go Home</button>
                                </div>
                            </div>
                        </div>
                        <>
                            <Card>
                                <CardContent>
                                    <Typography variant="h5">Room ID: {props.roomId}</Typography>
                                </CardContent>
                            </Card>
                            <h3 className="player-turn">Players: {blackPlayer._name}, {whitePlayer._name}. {'\u00A0'} Current turn: {currentPlayer._name} {'\u00A0'} {currentPlayer._color === Colors.WHITE ? <img src={logo_white} alt="white"/> : <img src={logo_black} alt="black"/>}</h3>
                            <div className="game">
                                <BoardComponent
                                    board={board}
                                    setBoard={setBoard}
                                    currentPlayer={currentPlayer}
                                    swapPlayers={swapPlayers}
                                    endGame={endGame}
                                    name={props.name}
                                    roomId={props.roomId}
                                    postRoom={postRoom}
                                    getRoom={getRoom}
                                    firstPlayer={blackPlayer._name}
                                    secondPlayer={whitePlayer._name}
                                />
                            </div>
                        </>
                    </> :
                    <>
                        {  board === null ? null :
                            <>
                                <Card>
                                    <CardContent>
                                        <Typography variant="h5">Room ID: {props.roomId}</Typography>
                                    </CardContent>
                                </Card>
                                <h3 className="player-turn">Players: {blackPlayer._name}, {whitePlayer._name}. {'\u00A0'} Current turn: {currentPlayer._name} {'\u00A0'} {currentPlayer._color === Colors.WHITE ? <img src={logo_white} alt="white"/> : <img src={logo_black} alt="black"/>}</h3>
                                <div className="game">
                                    <BoardComponent
                                        board={board}
                                        setBoard={setBoard}
                                        currentPlayer={currentPlayer}
                                        swapPlayers={swapPlayers}
                                        endGame={endGame}
                                        name={props.name}
                                        roomId={props.roomId}
                                        postRoom={postRoom}
                                        getRoom={getRoom}
                                        firstPlayer={blackPlayer._name}
                                        secondPlayer={whitePlayer._name}
                                    />
                                </div>
                            </>
                        }
                    </>
            }
        </>
    );
}