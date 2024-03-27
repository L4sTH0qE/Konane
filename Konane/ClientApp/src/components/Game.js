import React, {Component, useEffect, useState} from 'react';
import BoardComponent from "./BoardComponent";
import {Board} from "../models/Board";
import {Player} from "../models/Player";
import "./Game.css"
import CellComponent from "./CellComponent";
import {Colors} from "../models/Colors";
import {Cell} from "../models/Cell";

export class Game extends Component {
    static displayName = Game.name;
    constructor(props) {
        super(props);
        this.state = {board: Board, whitePlayer: Player, blackPlayer: Player, currentPlayer: Player};
        this.restart = this.restart.bind(this);
        this.setBoard = this.setBoard.bind(this);
        this.setWhitePlayer = this.setWhitePlayer.bind(this);
        this.setBlackPlayer = this.setBlackPlayer.bind(this);
        this.setCurrentPlayer = this.setCurrentPlayer.bind(this);
        this.swapPlayers = this.swapPlayers.bind(this);
    }

    componentDidMount() {
        this.restart();
    }
    
    restart() {
        const newBoard = new Board(8);
        const newWhitePlayer = new Player (Colors.WHITE);
        const newBlackPlayer = new Player (Colors.BLACK);
        newBoard.addFigures();
        this.setBoard(newBoard);
        this.setWhitePlayer(newWhitePlayer);
        this.setBlackPlayer(newBlackPlayer);
        this.setCurrentPlayer(newBlackPlayer)
    }

    swapPlayers() {
        this.setCurrentPlayer(this.state.currentPlayer._color === Colors.WHITE ? this.state.blackPlayer : this.state.whitePlayer);
    }
    
    setBoard(newBoard) {
        this.setState({ 
            board: newBoard 
        });
    }

    setWhitePlayer(player) {
        this.setState({
            whitePlayer: player
        });
    }

    setBlackPlayer(player) {
        this.setState({
            blackPlayer: player
        });
    }

    setCurrentPlayer(player) {
        this.setState({
            currentPlayer: player
        });
    }

    render() {
        return (
            <div className="game">
                <BoardComponent 
                    board={this.state.board} 
                    setBoard={this.setBoard} 
                    currentPlayer={this.state.currentPlayer} 
                    swapPlayers={this.swapPlayers}
                />
            </div>
        );
    }
}
