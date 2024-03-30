import React, {Component, useEffect, useMemo, useState} from 'react';
import BoardComponent from "./BoardComponent";
import {Board} from "../../models/Board";
import {Player} from "../../models/Player";
import {Navigate} from "react-router-dom"
import "./Game.css"
import {Colors} from "../../models/Colors";
import logo_white from "../../assets/checkers_top_white.png";
import logo_black from "../../assets/checkers_top_black.png";
import {Card, CardContent, Typography} from "@mui/material";

export default function  Game (props) {
    const [board, setBoard] = useState(null);
    const [whitePlayer, setWhitePlayer] = useState(null);
    const [blackPlayer, setBlackPlayer] = useState(null);
    const [currentPlayer, setCurrentPlayer] = useState(null);
    const [winner, setWinner] = useState(null);
    const [gameOver, setGameOver] = useState(false);
    const [redirect, setRedirect] = useState(false);

    useMemo(() => {
        console.log("BoardReset");
        if (!getRoom(props.roomId)) {
            restart();
        }
    }, []);

    function restart() {
        const newBlackPlayer = new Player (Colors.BLACK);
        const newWhitePlayer = new Player (Colors.WHITE);
        newBlackPlayer._name = props.name;
        newBlackPlayer._isBot = false;
        newWhitePlayer._isBot = props.isBot;
        setBlackPlayer(newBlackPlayer);
        setWhitePlayer(newWhitePlayer);
        setCurrentPlayer(newBlackPlayer)

        const newBoard = new Board(props.size);
        newBoard.addFigures();
        newBoard.highlightCellsToChoose(newBlackPlayer);
        setBoard(newBoard);

        addRoom(props.roomId);
    }

    function swapPlayers() {
        setCurrentPlayer(currentPlayer._color === Colors.WHITE ? blackPlayer : whitePlayer);
    }

    function endGame(currentPlayer) {
        setWinner(currentPlayer === blackPlayer ? whitePlayer : blackPlayer);
        setGameOver(true);
    }

    async function addRoom(roomId) {
        await fetch('/room', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ roomId: roomId, firstPlayer: blackPlayer, secondPlayer: whitePlayer, currentPlayer: currentPlayer, board: board })
        });
        console.log("RoomPost");
    }

    async function getRoom(roomId) {
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
                setBlackPlayer(newBlackPlayer);
                setWhitePlayer(newWhitePlayer);
            } else {
                newWhitePlayer._name = room.secondPlayer;
            }
            setBlackPlayer(newBlackPlayer);
            setWhitePlayer(newWhitePlayer);
            setCurrentPlayer(room.currentPlayer);

            const tmp = room.board;
            const proxyBoard = tmp.json();
            const newBoard = new Board(proxyBoard._size);
            newBoard._cells = proxyBoard._cells;
            setBoard(newBoard);

            console.log("RoomGet");
            return true;
        } catch (error) {
            console.error('Failed to fetch data:', error);
            return false;
        }
    }

    useEffect(() => {
        if (gameOver === false) return;
        return(
            <>
                <div className="myModal" >
                    <div className="myModalContent">
                        <h3>Game over!<br/> Winner is: {winner._color === Colors.WHITE ? <img src={logo_white} alt="white"/> : <img src={logo_black} alt="black"/>}</h3>
                        <div className="custom">
                            <button className="btn btn-primary chs-btn-center" onClick={() => setRedirect(true)}>Go Home</button>
                        </div>
                    </div>
                </div>
                {/*                <Card>
                    <CardContent>
                        <Typography variant="h5">Room ID: {this.props.roomId}</Typography>
                    </CardContent>
                </Card>
                <div className="game">
                    <BoardComponent
                        board={this.state.board}
                        setBoard={this.setBoard}
                        currentPlayer={this.state.currentPlayer}
                        swapPlayers={this.swapPlayers}
                        endGame={this.endGame}
                    />
                </div>*/}
            </>
        );
    }, [gameOver]);

    useEffect(() => {
        if (redirect === false) return;
        return(
            <Navigate to='/' replace={true}/>
        );
    }, [redirect]);


    return (
        <>
            <Card>
                <CardContent>
                    <Typography variant="h5">Room ID: {props.roomId}</Typography>
                </CardContent>
            </Card>
            <div className="game">
                <BoardComponent
                    board={board}
                    setBoard={setBoard}
                    currentPlayer={currentPlayer}
                    swapPlayers={swapPlayers}
                    endGame={endGame}
                />
            </div>
        </>
    );
}