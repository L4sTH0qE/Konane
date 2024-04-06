import React, {useEffect, useMemo, useState} from 'react';
import BoardComponent from "./BoardComponent";
import {Board} from "../../models/Board";
import {Player} from "../../models/Player";
import {Figure} from "../../models/Figure";
import {Colors} from "../../models/Colors";
import {Navigate} from "react-router-dom";
import {Box, Button, Card, CardContent, Typography} from "@mui/material";
import "./Game.css";
import logo_white from "../../assets/checkers_top_white.png";
import logo_black from "../../assets/checkers_top_black.png";
import useInterval from "../useInterval";

const flatted = require('flatted');

export default function  Game (props) {
    const [board, setBoard] = useState(null);
    const [whitePlayer, setWhitePlayer] = useState(null);
    const [blackPlayer, setBlackPlayer] = useState(null);
    const [currentPlayer, setCurrentPlayer] = useState(null);
    const [winner, setWinner] = useState(null);
    const [gameOver, setGameOver] = useState(false);
    const [redirect, setRedirect] = useState(false);
    const [generate, setGenerate] = useState(false);
    const [active, setActive] = useState(false);
    const [update, setUpdate] = useState(false);
    const [highlight, setHighlight] = useState(false);
    const [winnerFlag, setWinnerFlag] = useState(false);

    useMemo(() => {
        if (!props.isBot) {
            joinRoom(props.roomId);
        } else {
            createBotRoom();
        }
    }, []);

    useEffect(() => {
        if (generate) {
            createRoom();
        }
    }, [generate]);

    function createBotRoom() {
        const newBlackPlayer = new Player(Colors.BLACK);
        const newWhitePlayer = new Player(Colors.WHITE);
        newBlackPlayer._name = props.name;
        newBlackPlayer._isBot = false;
        newWhitePlayer._name = "BOT";
        newWhitePlayer._isBot = true;
        setBlackPlayer(newBlackPlayer);
        setWhitePlayer(newWhitePlayer);
        setCurrentPlayer(newBlackPlayer);
        const newBoard = new Board(props.size);
        newBoard.addFigures();
        setBoard(newBoard);
        console.log("CreateBotRoom");
    }

    async function createRoom() {
        const newBlackPlayer = new Player(Colors.BLACK);
        const newWhitePlayer = new Player(Colors.WHITE);
        newBlackPlayer._name = props.name;
        newBlackPlayer._isBot = false;
        newWhitePlayer._isBot = false;
        setBlackPlayer(newBlackPlayer);
        setWhitePlayer(newWhitePlayer);
        setCurrentPlayer(newBlackPlayer);
        const newBoard = new Board(props.size);
        newBoard.addFigures();
        setBoard(newBoard);
        await fetch('/room', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ roomId: props.roomId, firstPlayer: newBlackPlayer._name, secondPlayer: newWhitePlayer._name, currentPlayer: newBlackPlayer._name, board: flatted.stringify(newBoard) })
        });
        console.log("CreateRoom");
    }

    async function joinRoom(roomId) {
        try {
            const response = await fetch('/room/' + roomId);
            const room = await response.json();
            const newBlackPlayer = new Player(Colors.BLACK);
            newBlackPlayer._name = room.firstPlayer;
            newBlackPlayer._isBot = false;
            const newWhitePlayer = new Player(Colors.WHITE);
            newWhitePlayer._isBot = false;
            if (room.secondPlayer === "" && room.firstPlayer !== props.name) {
                newWhitePlayer._name = props.name;
            } else {
                newWhitePlayer._name = room.secondPlayer;
                newBlackPlayer._isFirstTurn = room.firstFirstTurn;
                newWhitePlayer._isFirstTurn = room.secondFirstTurn;
            }
            setBlackPlayer(newBlackPlayer);
            setWhitePlayer(newWhitePlayer);

            room.currentPlayer === newBlackPlayer._name ? setCurrentPlayer(newBlackPlayer) : setCurrentPlayer(newWhitePlayer);

            const tmp = flatted.parse(room.board);
            const newBoard = new Board(tmp._size);
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
            setBoard(newBoard);
            if (room.currentPlayer !== props.name) {
                setUpdate(true);
            }
            console.log("JoinRoom");
            if(room.status === "Waiting" && newWhitePlayer._name !== "") {
                await fetch('/room', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ roomId: roomId, firstPlayer: newBlackPlayer._name, secondPlayer: newWhitePlayer._name, currentPlayer: newBlackPlayer._name, board: flatted.stringify(newBoard) })
                });
            }
            return true;
        } catch (error) {
            setGenerate(true);
            console.error('Failed to fetch data:', error);
            return false;
        }
    }

    async function updatePlayers() {
        if (!props.isBot) {
            try {
                const response = await fetch('/room/' + props.roomId);
                const room = await response.json();
                if (blackPlayer._name === "" && room.firstPlayer !== "") {
                    blackPlayer._name = room.firstPlayer;
                }
                if (whitePlayer._name === "" && room.secondPlayer !== "") {
                    whitePlayer._name = room.secondPlayer;
                    setActive(true);
                }
                setHighlight(true);
                console.log("UpdatePlayers");
            } catch (error) {
                console.error('Failed to fetch data:', error);
            }
        }
    }

    async function updateBoard() {
        if (!gameOver && !props.isBot) {
            if (currentPlayer._name !== props.name && update) {
                try {
                    const response = await fetch('/room/' + props.roomId);
                    const room = await response.json();
                    if (room.firstTurnFinished && room.secondTurnFinished) {
                        setWinner(currentPlayer === blackPlayer ? whitePlayer : blackPlayer);
                        setGameOver(true);
                        console.log("GameOver");
                    }
                    const tmp = flatted.parse(room.board);
                    const newBoard = new Board(tmp._size);
                    for (let i = 0; i < newBoard._size; ++i) {
                        for (let j = 0; j < newBoard._size; ++j) {
                            const cell = tmp._cells[i][j];
                            if (cell._figure !== null) {
                                new Figure(cell._figure._color, newBoard._cells[i][j]);
                            }
                        }
                    }
                    setBoard(newBoard);
                    if (!(room.firstTurnFinished && room.secondTurnFinished)) {
                        if (props.name === whitePlayer._name) {
                            if (room.firstTurnFinished && room.currentPlayer === props.name) {
                                setUpdate(false);
                                swapPlayers();
                                setHighlight(true);
                            }
                        } else if (props.name === blackPlayer._name) {
                            if (room.secondTurnFinished && room.currentPlayer === props.name) {
                                setUpdate(false);
                                swapPlayers();
                                setHighlight(true);
                            }
                        }
                    }
                    console.log("UpdateBoard");
                } catch (error) {
                    console.error('Failed to fetch data:', error);
                }
            }
        }
    }

    async function postBoard(turnFinished) {
        if (!props.isBot) {
            await fetch('/room', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    roomId: props.roomId,
                    firstPlayer: blackPlayer._name,
                    secondPlayer: whitePlayer._name,
                    currentPlayer: turnFinished ? (props.name === blackPlayer._name ? whitePlayer._name : blackPlayer._name) : (props.name === blackPlayer._name ? blackPlayer._name : whitePlayer._name),
                    board: flatted.stringify(board),
                    firstTurnFinished: props.name === blackPlayer._name ? turnFinished : false,
                    secondTurnFinished: props.name === whitePlayer._name ? turnFinished : false
                })
            });
            setUpdate(turnFinished);
            if (turnFinished) {
                setHighlight(false);
            }
            console.log("PostBoard");
        }
    }

    async function finishBoard() {
        if (!props.isBot) {
            await fetch('/room', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    roomId: props.roomId,
                    firstPlayer: blackPlayer._name,
                    secondPlayer: whitePlayer._name,
                    currentPlayer: props.name,
                    board: flatted.stringify(board),
                    firstTurnFinished: true,
                    secondTurnFinished: true
                })
            });
            console.log("FinishBoard");
        }
    }

    useInterval(() => {(blackPlayer._name === "" || whitePlayer._name === "") ? updatePlayers() : updateBoard() }, 1000)

    function swapPlayers() {
        setCurrentPlayer(currentPlayer._color === Colors.WHITE ? blackPlayer : whitePlayer);
    }

    async function endGame(currentPlayer) {
        setWinner(currentPlayer === blackPlayer ? whitePlayer : blackPlayer);
        finishBoard(currentPlayer);
        setGameOver(true);
        console.log("GameOver");
        if (!props.isBot) {
            if (!winnerFlag) {
                setWinnerFlag(true);
                let name = currentPlayer === blackPlayer ? whitePlayer._name : blackPlayer._name;
                const response = await fetch('/user/' + name);
                const user = await response.json();
                let wins = user.wins + 1;
                fetch('/user', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ name: name, wins: wins })
                });
            }
        }
    }

    return (
        <>
            {redirect === true ? <Navigate to='/' replace={true}/> :
                gameOver === true ?             <>
                        <div className="myModal" >
                            <div className="myModalContent">
                                <h3>Game over!<br/> Winner is: {winner._color === Colors.WHITE ? whitePlayer._name : blackPlayer._name}</h3>
                                <div className="custom">
                                    <Box textAlign='center' display='flex' justifyContent='space-between'>
                                        <Button variant="contained" onClick={() => {
                                            setRedirect(true);
                                        }}>Return to Home Page 
                                        </Button>
                                    </Box>
                                </div>
                            </div>
                        </div>
                        <>
                            <Card>
                                <CardContent>
                                    <Typography variant="h5">Room ID: {props.isBot ? "private" : props.roomId}</Typography>
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
                                    firstPlayer={blackPlayer._name}
                                    secondPlayer={whitePlayer._name}
                                    postBoard={postBoard}
                                    update={update}
                                    highlight={highlight}
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
                                <h3 className="player-turn">Players: {blackPlayer._name}{whitePlayer._name === "" ? "" : ","} {whitePlayer._name} {'\u00A0'} Current turn: {currentPlayer._name} {'\u00A0'} {currentPlayer._color === Colors.WHITE ? <img src={logo_white} alt="white"/> : <img src={logo_black} alt="black"/>}</h3>
                                <div className="game">
                                    <BoardComponent
                                        board={board}
                                        setBoard={setBoard}
                                        currentPlayer={currentPlayer}
                                        swapPlayers={swapPlayers}
                                        endGame={endGame}
                                        name={props.name}
                                        firstPlayer={blackPlayer._name}
                                        secondPlayer={whitePlayer._name}
                                        postBoard={postBoard}
                                        update={update}
                                        highlight={highlight}
                                        isBot={props.isBot}
                                    />
                                </div>
                            </>
                        }
                    </>
            }
        </>
    );
}