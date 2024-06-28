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
import copy from "../../assets/copy.png";
import useInterval from "../useInterval";

const flatted = require('flatted');

/**
 * Functional component that describes gameplay.
 */
export default function  Game (props) {
    const [board, setBoard] = useState(null);
    const [whitePlayer, setWhitePlayer] = useState(null);
    const [blackPlayer, setBlackPlayer] = useState(null);
    const [currentPlayer, setCurrentPlayer] = useState(null);
    const [winner, setWinner] = useState(null);
    const [gameOver, setGameOver] = useState(false);
    const [redirect, setRedirect] = useState(false);
    const [generate, setGenerate] = useState(false);
    const [update, setUpdate] = useState(false);
    const [highlight, setHighlight] = useState(false);
    let winnerFlag = false;

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

    /**
     * Function to create room with bot.
     */
    function createBotRoom() {
        const newBlackPlayer = new Player(Colors.BLACK);
        const newWhitePlayer = new Player(Colors.WHITE);
        if (props.isFirst) {
            newBlackPlayer._name = props.name;
            newBlackPlayer._isBot = false;
            newWhitePlayer._name = "BOT";
            newWhitePlayer._isBot = true;
        } else {
            newBlackPlayer._name = "BOT";
            newBlackPlayer._isBot = true;
            newWhitePlayer._name = props.name;
            newWhitePlayer._isBot = false;
        }
        setBlackPlayer(newBlackPlayer);
        setWhitePlayer(newWhitePlayer);
        setCurrentPlayer(newBlackPlayer);
        const newBoard = new Board(props.size);
        newBoard.addFigures();
        setBoard(newBoard);
        console.log("CreateBotRoom");
    }

    /**
     * Function to create room with player.
     */
    async function createRoom() {
        const newBlackPlayer = new Player(Colors.BLACK);
        const newWhitePlayer = new Player(Colors.WHITE);
        if (props.isFirst) {
            newBlackPlayer._name = props.name;
        } else {
            newWhitePlayer._name = props.name;
            setUpdate(true);
        }
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

    /**
     * Function to join room by its id.
     * @param roomId - Room id
     */
    async function joinRoom(roomId) {
        try {
            const response = await fetch('/room/' + roomId);
            const room = await response.json();
            
            const newBlackPlayer = new Player(Colors.BLACK);
            newBlackPlayer._name = room.firstPlayer;
            newBlackPlayer._isBot = false;
            newBlackPlayer._isFirstTurn = room.firstFirstTurn;
            const newWhitePlayer = new Player(Colors.WHITE);
            newWhitePlayer._name = room.secondPlayer;
            newWhitePlayer._isBot = false;
            newWhitePlayer._isFirstTurn = room.secondFirstTurn;
            
            if (room.secondPlayer === "" && room.firstPlayer !== props.name) {
                newWhitePlayer._name = props.name;
            } else if (room.firstPlayer === "" && room.secondPlayer !== props.name) {
                newBlackPlayer._name = props.name;
            }
            setBlackPlayer(newBlackPlayer);
            setWhitePlayer(newWhitePlayer);

            room.currentPlayer === room.firstPlayer ? setCurrentPlayer(newBlackPlayer) : setCurrentPlayer(newWhitePlayer);
            if ((room.currentPlayer === "" && newBlackPlayer._name === props.name) || room.currentPlayer === props.name) {
                setHighlight(true);
            }
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
            if (room.currentPlayer !== props.name && room.currentPlayer !== "") {
                setUpdate(true);
            }
            console.log("JoinRoom");
            if(room.status === "Waiting" && newWhitePlayer._name !== "" && newBlackPlayer._name !== "") {
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

    /**
     * Function to update players.
     */
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
                    setHighlight(true);
                }
                console.log("UpdatePlayers");
            } catch (error) {
                console.error('Failed to fetch data:', error);
            }
        }
    }

    /**
     * Function to update board.
     */
    async function updateBoard() {
        if (!gameOver && !props.isBot) {
            if (currentPlayer._name !== props.name && update) {
                try {
                    const response = await fetch('/room/' + props.roomId);
                    const room = await response.json();
                    // If the game is over
                    if (room.firstTurnFinished && room.secondTurnFinished) {
                        setWinner(currentPlayer === blackPlayer ? whitePlayer : blackPlayer);
                        setGameOver(true);
                        console.log("GameOver");
                        if (!winnerFlag) {
                            winnerFlag = true;
                            let name = currentPlayer === blackPlayer ? whitePlayer._name : blackPlayer._name;
                            if (name === props.name) {
                                const response = await fetch('/user/' + name);
                                const user = await response.json();
                                let wins = user.wins + 1;
                                await fetch('/user', {
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/json'
                                    },
                                    body: JSON.stringify({ name: name, wins: wins })
                                });
                            }
                        }
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

    /**
     * Function to send Room HTTP POST request with updated board.
     * @param turnFinished - Has the player finished his turn
     */
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

    /**
     * Function to send Room HTTP POST request with updated board when the game is over.
     */
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

    /**
     * Function to swap players.
     */
    function swapPlayers() {
        setCurrentPlayer(currentPlayer._color === Colors.WHITE ? blackPlayer : whitePlayer);
    }

    /**
     * Function to set game over state.
     * @param currentPlayer - Loser
     */
    async function endGame(currentPlayer) {
        setWinner(currentPlayer === blackPlayer ? whitePlayer : blackPlayer);
        await finishBoard(currentPlayer);
        setGameOver(true);
        console.log("GameOver");
    }

    return (
        <>
            {redirect === true ? <Navigate to='/' replace={true}/> :
                gameOver === true ?             <>
                        <div className="myModal" >
                            <div className="myModalContent">
                                <h3>Game over!<br/><br/> {winner._name === props.name ? "You win!" : "You lose!"}</h3>
                                <div className="custom">
                                    <Box textAlign='center' display='flex' justifyContent='center'>
                                        <Button className="end-btn" sx = {{color: '#cda88b', backgroundColor: '#202020', "&:hover": {color: '#b28c6e', backgroundColor: '#191919'}}} variant="text" onClick={() => {
                                            setRedirect(true);
                                        }}>Return to Home Page
                                        </Button>
                                    </Box>
                                </div>
                            </div>
                        </div>
                        <>
                            <Card className="room-id" sx = {{borderRadius: 5, boxShadow: '0 0 10px #b28c6e'}}>
                                <CardContent sx = {{color: '#202020', backgroundColor: '#cda88b', display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                                    <Typography variant="h5">
                                        Room ID: {props.roomId}
                                    </Typography>
                                    {props.isBot ? <></> : <Button className="copy-btn" sx = {{borderRadius: 5, border: '2px solid #191919', backgroundColor: '#cda88b', "&:hover": {color: '#202020', backgroundColor: '#b28c6e'}}} variant="text" onClick={() => {navigator.clipboard.writeText(props.roomId)}}>
                                        <img src={copy} alt="copy" height="48px"/>
                                    </Button>}
                                </CardContent>
                            </Card>
                            <h3 className="player-turn white-text">Status: Finished</h3>
                            <h3 className="player-turn white-text">Players: {blackPlayer._name}{whitePlayer._name === "" ? "" : ","} {whitePlayer._name} {'\u00A0'} Current turn: {currentPlayer._name}{'\u00A0'}{currentPlayer._color === Colors.WHITE ? <img className="current-player" src={logo_white} alt="white"/> : <img className="current-player" src={logo_black} alt="black"/>}</h3>
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
                                    highlight={highlight}
                                    isBot={props.isBot}
                                />
                            </div>
                        </>
                    </> :
                    <>
                        {  board === null ? null :
                            <>
                                <Card className="room-id" sx = {{borderRadius: 5, boxShadow: '0 0 10px #b28c6e'}}>
                                    <CardContent sx = {{color: '#202020', backgroundColor: '#cda88b', display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                                        <Typography variant="h5">
                                            Room ID: {props.roomId}
                                        </Typography>
                                        {props.isBot ? <></> : <Button className="copy-btn" sx = {{borderRadius: 5, border: '2px solid #191919', backgroundColor: '#cda88b', "&:hover": {color: '#202020', backgroundColor: '#b28c6e'}}} variant="text" onClick={() => {navigator.clipboard.writeText(props.roomId)}}>
                                            <img src={copy} alt="copy" height="48px"/>
                                        </Button>}
                                    </CardContent>
                                </Card>
                                <h3 className="player-turn white-text">Status: {whitePlayer._name === "" || blackPlayer._name === "" ? "Waiting for a second player..." : "Active"}</h3>
                                <h3 className="player-turn white-text">Players: {blackPlayer._name}{whitePlayer._name === "" || blackPlayer._name === "" ? "" : ","} {whitePlayer._name} {'\u00A0'} Current turn: {currentPlayer._name}{'\u00A0'}{currentPlayer._color === Colors.WHITE ? <img className="current-player" src={logo_white} alt="white"/> : <img className="current-player" src={logo_black} alt="black"/>}</h3>
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