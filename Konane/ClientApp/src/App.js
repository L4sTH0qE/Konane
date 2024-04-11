import React, {useEffect, useState, } from 'react';
import {Navigate, Route, Routes, useLocation, useNavigate} from 'react-router-dom';
import {Box, Button, Stack, TextField} from "@mui/material";
import './custom.css';
import { Layout } from './components/Layout';
import CustomDialog from "./components/CustomDialog";
import Home from "./components/Pages/Home";
import Rules from "./components/Pages/Rules";
import InitGame from "./components/Pages/InitGame";
import GameOptions from "./components/Pages/GameOptions";
import logo_bot from "./assets/bot.png";
import logo_player from "./assets/player.png";
import konane_board from "./assets/Konane_board.jpg";

export default function App(props) {
    const [username, setUsername] = useState("");
    const [usernameSubmitted, setUsernameSubmitted] = useState(false);
    const [wins, setWins] = useState(0);
    const [logIn, setLogIn] = useState(false);
    const [signUp, setSignUp] = useState(false);
    const [userError, setUserError] = useState("");

    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        if (location.pathname === "/game-room") {
            navigate("/game-options");
        }
    }, []);

    async function checkLogInInput(userInput) {
        const json = await getUser(userInput);  // command waits until completion

        if (json === "No user with such ID") {
            setUserError("No user with such ID");
        } else {
            setWins(json.wins);
            setUsername(json.name);
            setLogIn(false); // close dialog
            setUsernameSubmitted(true); // indicate that username has been submitted
        }
    }

    async function checkSignUpInput(userInput) {
        const json = await getUser(userInput);  // command waits until completion

        if (json === "No user with such ID") {
            addUser(userInput);
            setWins(0);
            setUsername(userInput);
            setSignUp(false); // close dialog
            setUsernameSubmitted(true); // indicate that username has been submitted
        } else {
            setUserError("There is a user with such ID");
        }
    }

    async function addUser(name) {
        await fetch('/user', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name: name, wins: 0 })
        });
        console.log("UserPost");
    }

    function getUser(name) {
        console.log("UserGet");
        return fetch('/user/' + name)
            .then((response)=>response.json())
            .then((responseJson)=>{return responseJson})
            .catch(() => {return "No user with such ID";});
    }

    return (
        <>
            <Layout>
                <Routes>
                    <Route key={true} path='/' element={usernameSubmitted ? <Home username={username} wins={wins}/> : <> </>} />;
                    <Route path='/rules' element={usernameSubmitted ? <Rules username={username}/> : <> </>} />;
                    <Route path='/game-options' element={usernameSubmitted ? <InitGame username={username}/> : <> </>} />;
                    <Route path='/game-room' element={usernameSubmitted ? <GameOptions username={username}/> : <> </>} />;
                </Routes>
            </Layout>
            { usernameSubmitted ? <></> :
                <>
                <h1 className="white-text">Take your Konane Experience to the next level</h1>
                <p><b>Konane</b> also known as <b>Hawaiian Checkers</b> is a two-player ancient board game of strategy from Hawaii. The game can be played on 6x6, 8x8 or 10x10 board. One player plays with WHITE pieces and another with BLACK pieces. The game starts with the board filled with both player's pieces with each player occupying half slots in an alternating pattern. BLACK starts first. Players alternate turn to play and capture at least one opponent piece.</p>
                <p>In the first turn black player can remove a black piece from one of the four central squares.</p>
                <p>The white player in his/her first turn can remove a white piece adjacent to the space left by the black player.</p>
                <p>In subsequent turns players simply capture adjacent opponent pieces by jumping over it to the vacant spot immediately after the opponent piece horizontally or vertically. Player can continue to capture opponent pieces in the same direction if possible in the same turn (optionally). Player can not change direction of movement in the same turn.</p>
                <p>The game ends when a player can not make any capture in his/her turn and that player loses the game.</p>
                
                
                <Stack
                    justifyContent="center"
                    alignItems="center"
                    sx={{ py: 1, height: "90vh" }}
                >
                    <CustomDialog
                        sx={{ backgroundColor: '#202020' }}
                        open={logIn} // leave open if username has not been selected
                        title="Enter a username" // Title of dialog
                        contentText="I have account" // content text of dialog
                        handleContinue={() => { // fired when continue is clicked
                            if (!username) return; // if username hasn't been entered, do nothing
                            checkLogInInput(username);
                        }}
                    >
                        <TextField // Input
                            autoFocus // automatically set focus on input (make it active).
                            margin="dense"
                            id="username"
                            label="Username"
                            name="username"
                            value={username}
                            required
                            onChange={(e) => setUsername(e.target.value)} // update username state with value
                            type="text"
                            fullWidth
                            variant="standard"
                            error={Boolean(userError)}
                            helperText={
                                !userError ? "Enter a username" : `Invalid username: ${userError}`
                            }
                        />
                    </CustomDialog>
                    <CustomDialog
                        sx={{ backgroundColor: '#202020' }}
                        open={signUp} // leave open if username has not been selected
                        title="Enter a username" // Title of dialog
                        contentText="Not a member" // content text of dialog
                        handleContinue={() => { // fired when continue is clicked
                            if (!username) return; // if username hasn't been entered, do nothing
                            checkSignUpInput(username);
                        }}
                    >
                        <TextField // Input
                            autoFocus // automatically set focus on input (make it active).
                            margin="dense"
                            id="username"
                            label="Username"
                            name="username"
                            value={username}
                            required
                            onChange={(e) => setUsername(e.target.value)} // update username state with value
                            type="text"
                            fullWidth
                            variant="standard"
                            error={Boolean(userError)}
                            helperText={
                                !userError ? "Enter a username" : `Invalid username: ${userError}`
                            }
                        />
                    </CustomDialog>

                    <Button sx = {{backgroundColor: '#202020', color: '#cda88b', "&:hover": {color: '#b28c6e', backgroundColor: '#191919'},  border: 2, borderColor: '#000000'}} variant="contained" onClick={() => { setLogIn(true); }}>
                        Log in
                    </Button>
                    <Button sx = {{color: '#cda88b', "&:hover": {color: '#b28c6e', backgroundColor: '#191919'}}} variant="text" onClick={() => { setSignUp(true); }}>
                        Sign up
                    </Button>
                </Stack>
                </>
            }
        </>
    );
}
