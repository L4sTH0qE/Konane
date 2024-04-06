import React, {useEffect, useState, } from 'react';
import {Route, Routes, useLocation, useNavigate} from 'react-router-dom';
import {TextField} from "@mui/material";
import './custom.css';
import { Layout } from './components/Layout';
import CustomDialog from "./components/CustomDialog";
import Home from "./components/Pages/Home";
import Rules from "./components/Pages/Rules";
import InitGame from "./components/Pages/InitGame";
import GameOptions from "./components/Pages/GameOptions";

export default function App(props) {
    const [username, setUsername] = useState("");
    const [usernameSubmitted, setUsernameSubmitted] = useState(false);
    const [wins, setWins] = useState(0);

    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        if (location.pathname === "/game-room") {
            navigate("/game-options");
        }
    }, []);

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

    async function getUser(name) {
        try {
            const response = await fetch('/user/' + name);
            const user = await response.json();
            if (username !== user.name || wins !== user.wins) {
                setWins(user.wins);
                setUsername(user.name);
            }
            console.log("UserGet");
        } catch (error) {
            console.error('Failed to fetch data:', error);
        }
    }

    return (
        <>
            <CustomDialog
                open={!usernameSubmitted} // leave open if username has not been selected
                title="Pick a username" // Title of dialog
                contentText="Please select a username" // content text of dialog
                handleContinue={() => { // fired when continue is clicked
                    if (!username) return; // if username hasn't been entered, do nothing
                    addUser(username);
                    getUser(username);
                    setUsernameSubmitted(true); // indicate that username has been submitted
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
                />
            </CustomDialog>
            <Layout>
                <Routes>
                    <Route key={true} path='/' element={usernameSubmitted ? <Home username={username} wins={wins}/> : <> </>} />;
                    <Route path='/rules' element={usernameSubmitted ? <Rules username={username}/> : <> </>} />;
                    <Route path='/game-options' element={usernameSubmitted ? <InitGame username={username}/> : <> </>} />;
                    <Route path='/game-room' element={usernameSubmitted ? <GameOptions username={username}/> : <> </>} />;
                </Routes>
            </Layout>
        </>
    );
}
