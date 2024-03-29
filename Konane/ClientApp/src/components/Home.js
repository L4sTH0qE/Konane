import React, {Component} from 'react';
import {TextField} from "@mui/material";
import CustomDialog from "./CustomDialog";

export class Home extends Component {
  static displayName = Home.name;
    
    constructor(props) {
        super(props);
        this.state = {username: String, usernameSubmitted: Boolean, user: String, wins: Number};
        this.setUsername = this.setUsername.bind(this);
        this.setUsernameSubmitted = this.setUsernameSubmitted.bind(this);
        this.addUser = this.addUser.bind(this);
        this.getUser = this.getUser.bind(this);
        this.setWins = this.setWins.bind(this);
    }

    componentDidMount() {
        this.setUsername(undefined || this.props.username);
        console.log(this.props.username);
        this.setWins(0);
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

    setWins(wins) {
        this.setState({
            wins: wins
        });
    }
    
    addUser(name) {
        fetch('/user', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username: name })
        });
        console.log("UserPost");
    }

    getUser(name) {
        this.state.user = fetch('/user?name=' + name);
        this.setWins(this.state.user.wins);
        console.log("UserGet");
    }
  
  render() {
    return (
      <>
        <h1>Hello, {this.state.username === undefined ? "stranger" : this.state.username}! Your victories: {this.state.wins}</h1>
        <p>This site is designed to provide its visitors with the best Konane experience they could ever have in their life!</p>
        <p>To help you get started, here are descriptions of navigation links:</p>
        <ul>
          <li><strong>Home</strong>. This is your start page. Here you can checkout your current profile name, stats and general info about this webapp.</li>
          <li><strong>Rules</strong>. The page that demonstrates the history of origin and the rules of the Konane board game. It shall also include a manual in the nearest future.</li>
          <li><strong>Play</strong>. The page with options of creating a room for playing with the specified settings and joining an already existing room by its 'Room ID'.</li>
        </ul>
      </>
    );
  }
}
