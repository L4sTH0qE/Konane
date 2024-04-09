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
                <Stack
                    justifyContent="center"
                    alignItems="center"
                    sx={{ py: 1, height: "90vh" }}
                >
                    <CustomDialog
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

                    <Button variant="contained" onClick={() => { setLogIn(true); }}>
                        Log in
                    </Button>
                    <Button variant="text" onClick={() => { setSignUp(true); }}>
                        Sign up
                    </Button>
                </Stack>
            }
        </>
    );
}
