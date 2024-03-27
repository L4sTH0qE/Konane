import React, {Component} from 'react';
import {Navigate} from "react-router-dom"
import "./Game.css"
import {Game} from "./Game";

export class GameOptions extends Component {

    static displayName = GameOptions.name;
    constructor(props) {
        super(props);
    }

    componentDidMount() {
    }

    render() {
        let size = 6;
        return (
            <div>
                <Game size={size}/>
            </div>
        );
    }
}
