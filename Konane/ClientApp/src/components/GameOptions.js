import React, {Component} from 'react';
import "./Game.css"
import {Game} from "./Game";
import { Container, TextField } from "@mui/material"
import CustomDialog from "./CustomDialog";

export class GameOptions extends Component {

    static displayName = GameOptions.name;
    constructor(props) {
        super(props);
        this.state = {username: String, usernameSubmitted: Boolean};
        this.setUsername = this.setUsername.bind(this);
        this.setUsernameSubmitted = this.setUsernameSubmitted.bind(this);
    }

    componentDidMount() {
        this.setUsername('');
        this.setUsernameSubmitted(false);
    }

    setUsername(username) {
        this.setState({
            username: username
        });
    }

    setUsernameSubmitted(usernameSubmitted) {
        this.setState({
            usernameSubmitted: usernameSubmitted
        });
    }

    render() {
        let size = 6;
        return (
            <>
                <Game size={size}/>
            </>
        );
    }
}

