import React, { Component } from 'react';
import { Route, Routes } from 'react-router-dom';
import {TextField} from "@mui/material";
import './custom.css';
import { Layout } from './components/Layout';
import CustomDialog from "./components/CustomDialog";
import Home from "./components/Pages/Home";
import Rules from "./components/Pages/Rules";
import InitGame from "./components/Pages/InitGame";
import GameOptions from "./components/Pages/GameOptions";

export default class App extends Component {
    static displayName = App.name;

    constructor(props) {
        super(props);
        this.state = {username: String, usernameSubmitted: Boolean, wins: Number};
        this.setUsername = this.setUsername.bind(this);
        this.setWins = this.setWins.bind(this);
        this.setUsernameSubmitted = this.setUsernameSubmitted.bind(this);
        this.addUser = this.addUser.bind(this);
    }

    componentDidMount() {
        this.setUsername('');
        this.setUsernameSubmitted(false);
        this.setWins(0);
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

    async addUser(name) {
        await fetch('/user', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name: name })
        });
        console.log("UserPost");
    }

    async getUser(name) {
        try {
            const response = await fetch('/user/' + name);
            const user = await response.json();
            if (this.state.username !== user.name || this.state.wins !== user.wins) {
                this.setState({user: user, wins: user.wins});
            }
            console.log("UserGet");
        } catch (error) {
            console.error('Failed to fetch data:', error);
        }
    }

    render() {
        return (
            <>
                <CustomDialog
                    open={!this.state.usernameSubmitted} // leave open if username has not been selected
                    title="Pick a username" // Title of dialog
                    contentText="Please select a username" // content text of dialog
                    handleContinue={() => { // fired when continue is clicked
                        if (!this.state.username) return; // if username hasn't been entered, do nothing
                        this.addUser(this.state.username);
                        this.getUser(this.state.username);
                        this.setUsernameSubmitted(true); // indicate that username has been submitted
                    }}
                >
                    <TextField // Input
                        autoFocus // automatically set focus on input (make it active).
                        margin="dense"
                        id="username"
                        label="Username"
                        name="username"
                        value={this.state.username}
                        required
                        onChange={(e) => this.setUsername(e.target.value)} // update username state with value
                        type="text"
                        fullWidth
                        variant="standard"
                    />
                </CustomDialog>
                <Layout>
                    <Routes>
                        <Route key={true} path='/' element={<Home username={this.state.username} wins={this.state.wins}/>} />;
                        <Route path='/rules' element={<Rules username={this.state.username}/>} />;
                        <Route path='/game-options' element={<InitGame username={this.state.username}/>} />;
                        <Route path='/game-room' element={<GameOptions username={this.state.username}/>} />;
                    </Routes>
                </Layout>
            </>
        );
    }
}
