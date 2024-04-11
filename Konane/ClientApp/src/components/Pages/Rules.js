import React from 'react';
import konane_board from "../../assets/Konane_board.jpg";

export default function Rules () {
    return (
        <div className="gray-text">
            <h1 className="white-text">Konane</h1>
            <p><b>Konane</b> also known as <b>Hawaiian Checkers</b> is a two-player ancient board game of strategy from Hawaii. The game can be played on 6x6, 8x8 or 10x10 board. One player plays with WHITE pieces and another with BLACK pieces. The game starts with the board filled with both player's pieces with each player occupying half slots in an alternating pattern. BLACK starts first. Players alternate turn to play and capture at least one opponent piece.</p>
            <p>In the first turn black player can remove a black piece from one of the four central squares. The white player in his/her first turn can remove a white piece adjacent to the space left by the black player.</p>
            <p>In subsequent turns players simply capture adjacent opponent pieces by jumping over it to the vacant spot immediately after the opponent piece horizontally or vertically. Player can continue to capture opponent pieces in the same direction if possible in the same turn (optionally). Player can not change direction of movement in the same turn.</p>
            <p>The game ends when a player can not make any capture in his/her turn and that player loses the game.</p>
            <img className="rules-image" src={konane_board} alt="Konane"/>
        </div>
    );
}
