import React, { Component } from 'react';
import { Route, Routes } from 'react-router-dom';
import AppRoutes from './AppRoutes';
import { Layout } from './components/Layout';
import './custom.css';
import CustomDialog from "./components/CustomDialog";
import {TextField} from "@mui/material";
import {Home} from "./components/Home";
import {Rules} from "./components/Rules";
import InitGame from "./components/InitGame";
import GameOptions from "./components/GameOptions";

export default class App extends Component {
  static displayName = App.name;

    constructor(props) {
        super(props);
        this.state = {username: String, usernameSubmitted: Boolean};
        this.setUsername = this.setUsername.bind(this);
        this.setUsernameSubmitted = this.setUsernameSubmitted.bind(this);
        this.addUser = this.addUser.bind(this);
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
                    <Route key={true} path='/' element={<Home username={this.state.username}/>} />;
                    <Route path='/rules' element={<Rules username={this.state.username}/>} />;
                    <Route path='/game-options' element={<InitGame username={this.state.username}/>} />;
                    <Route path='/game-room' element={<GameOptions username={this.state.username}/>} />;
                </Routes>
            </Layout>
        </>
    );
  }
}
