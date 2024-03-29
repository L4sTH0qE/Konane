import React, {Component} from 'react';
import BoardComponent from "./BoardComponent";
import {Board} from "../models/Board";
import {Player} from "../models/Player";
import {Navigate} from "react-router-dom"
import "./Game.css"
import {Colors} from "../models/Colors";
import logo_white from "../assets/checkers_top_white.png";
import logo_black from "../assets/checkers_top_black.png";

export class Game extends Component {
    
    static displayName = Game.name;
    constructor(props) {
        super(props);
        this.state = {board: Board, whitePlayer: Player, blackPlayer: Player, currentPlayer: Player, winner: Player, gameOver: Boolean, redirect: Boolean};
        this.restart = this.restart.bind(this);
        this.setBoard = this.setBoard.bind(this);
        this.setWhitePlayer = this.setWhitePlayer.bind(this);
        this.setBlackPlayer = this.setBlackPlayer.bind(this);
        this.setCurrentPlayer = this.setCurrentPlayer.bind(this);
        this.swapPlayers = this.swapPlayers.bind(this);
        this.endGame = this.endGame.bind(this);
        this.goToHomePage = this.goToHomePage.bind(this);
    }

    componentDidMount() {
        this.restart();
    }
    
    restart() {
        this.setState({
            gameOver: false,
            redirect: false
        });
        const newBoard = new Board(this.props.size);
        const newWhitePlayer = new Player (Colors.WHITE);
        const newBlackPlayer = new Player (Colors.BLACK);
        this.setWhitePlayer(newWhitePlayer);
        this.setBlackPlayer(newBlackPlayer);
        this.setCurrentPlayer(newBlackPlayer)
        newBoard.addFigures();
        newBoard.highlightCellsToChoose(newBlackPlayer);
        this.setBoard(newBoard);
    }

    swapPlayers() {
        this.setCurrentPlayer(this.state.currentPlayer._color === Colors.WHITE ? this.state.blackPlayer : this.state.whitePlayer);
    }

    endGame(currentPlayer) {
        this.setState({
            winner: currentPlayer === this.state.blackPlayer ? this.state.whitePlayer : this.state.blackPlayer,
            gameOver: true
        });
    }
    modalEnd = ()=>{
        return(
            <div className="myModal" >
                <div className="myModalContent">
                    <h3>Game over!<br/> Winner is: {this.state.winner._color === Colors.WHITE ? <img src={logo_white} alt="white"/> : <img src={logo_black} alt="black"/>}</h3>
                    <div className="custom">
                        <button className="btn btn-primary end-btn-left" onClick={this.restart}>Play again</button>
                        <button className="btn btn-primary end-btn-right" onClick={this.goToHomePage}>Go to Home</button>
                        {this.state.redirect === true ? <Navigate to='/' replace={true}/> : null}
                    </div>
                </div>
            </div>
        );
    }
    
    goToHomePage = ()=>{
        this.setState({
            redirect: true
        });
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
            <>
            {this.state.gameOver ? this.modalEnd() : null}
            <div className="game">
                <BoardComponent
                    board={this.state.board}
                    setBoard={this.setBoard}
                    currentPlayer={this.state.currentPlayer}
                    swapPlayers={this.swapPlayers}
                    endGame={this.endGame}
                />
            </div>
            </>
        );
    }
}