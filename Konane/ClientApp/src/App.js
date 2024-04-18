import React, {useEffect, useState, } from 'react';
import {Route, Routes, useLocation, useNavigate} from 'react-router-dom';
import {Button, Stack} from "@mui/material";
import './custom.css';
import { Layout } from './components/Layout';
import CustomDialog from "./components/CustomDialog";
import CustomTextField from "./components/CustomTextField";
import Home from "./components/Pages/Home";
import Rules from "./components/Pages/Rules";
import InitGame from "./components/Pages/InitGame";
import GameOptions from "./components/Pages/GameOptions";
import konane_game from "./assets/Konane_game.png";

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

        if (json === "No user with such username") {
            setUserError("No user with such username");
        } else {
            setWins(json.wins);
            setUsername(json.name);
            setLogIn(false); // close dialog
            setUsernameSubmitted(true); // indicate that username has been submitted
        }
    }

    async function checkSignUpInput(userInput) {
        const json = await getUser(userInput);  // command waits until completion

        if (json === "No user with such username") {
            await addUser(userInput);
            setWins(0);
            setUsername(userInput);
            setSignUp(false); // close dialog
            setUsernameSubmitted(true); // indicate that username has been submitted
        } else {
            setUserError("There is a user with such username");
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
            .catch(() => {return "No user with such username";});
    }

    return (
        <>
            {location.pathname === "/game-options"  && usernameSubmitted ? <div className="bg"></div> : <div className="bg-main"></div>}
            <Layout>
                <Routes>
                    <Route key={true} path='/' element={usernameSubmitted ? <Home username={username} wins={wins}/> : <> </>} />;
                    <Route path='/rules' element={usernameSubmitted ? <Rules username={username}/> : <> </>} />;
                    <Route path='/game-options' element={usernameSubmitted ? <InitGame username={username}/> : <> </>} />;
                    <Route path='/game-room' element={usernameSubmitted ? <GameOptions username={username}/> : <> </>} />;
                </Routes>
            </Layout>
            { usernameSubmitted ? <></> :
                <div className="start-content">
                    <div className="start-text">
                        <h1 className="white-text">TAKE YOUR KONANE EXPERIENCE TO </h1>
                        <h1 className="white-text">THE NEXT LEVEL</h1>
                        <p className="gray-text">Play with konane players from around the world to test your skills or practice in special 'Player vs Bot' mode.</p>
                        <Stack
                            marginTop={20}
                            alignItems="center"
                            sx={{ py: 1, height: "300px" }}
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
                                <CustomTextField // Input
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
                                <CustomTextField // Input
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

                            <Button className="sgn-btn" sx = {{color: '#cda88b', backgroundColor: '#202020', "&:hover": {color: '#b28c6e', backgroundColor: '#191919'}}} variant="text" onClick={() => { setLogIn(true); }}>
                                Log in
                            </Button>
                            <br/>
                            <Button className="sgn-btn" sx = {{color: '#cda88b', backgroundColor: '#202020', "&:hover": {color: '#b28c6e', backgroundColor: '#191919'}}} variant="text" onClick={() => { setSignUp(true); }}>
                                Sign up
                            </Button>
                        </Stack>
                    </div>
                    <img className="start-image" src={konane_game} alt="Konane"/>
                </div>
            }
        </>
    );
}
