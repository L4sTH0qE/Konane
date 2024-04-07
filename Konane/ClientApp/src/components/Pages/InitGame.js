import {Box, Button, Stack, TextField} from "@mui/material";
import React, { useState } from "react";
import CustomDialog from "../CustomDialog";
import {Navigate} from "react-router-dom";
import logo_bot from "../../assets/bot.png";
import logo_player from "../../assets/player.png";
const { v4: uuidV4 } = require('uuid');

export default function InitGame(props) {
    const [roomDialogOpen, setRoomDialogOpen] = useState(false);
    const [roomInput, setRoomInput] = useState("");
    const [roomError, setRoomError] = useState("");
    const [createRoom, setCreateRoom] = useState(false);
    const [start, setStart] = useState(false);
    const [roomId, setRoomId] = useState("");
    const [size, setSize] = useState(8);
    const [bot, setBot] = useState(false);
    const [isFirst, setIsFirst] = useState(true);
    const [data, setData] = useState({roomId: roomId, size: size, bot: bot, isFirst: isFirst});

    function getRoom(roomId) {
        return fetch('/room/' + roomId)
            .then((response)=>response.json())
            .then((responseJson)=>{return responseJson})
            .catch(() => {return "No room with such ID";});
    }

    async function checkRoomInput(roomInput) {
        const json = await getRoom(roomInput);  // command waits until completion
        console.log(json);
        if (json === "No room with such ID") {
            setRoomError("No room with such ID");
        } else if (json.status === "Finished") {
            setRoomError("Room with such ID is closed");
        } else if (json.status === "Active" && json.firstPlayer !== props.username && json.secondPlayer !== props.username) {
            setRoomError("Room with such ID is active");
        } else {
            setData({roomId: roomInput, size: size, bot: bot, isFirst: isFirst});
            setRoomDialogOpen(false); // close dialog
            setStart(true);
        }
    }

    return (
        <Stack
            justifyContent="center"
            alignItems="center"
            sx={{ py: 1, height: "100vh" }}
        >
            <CustomDialog
                open={roomDialogOpen}
                handleClose={() => setRoomDialogOpen(false)}
                title="Select Room to Join"
                contentText="Enter a valid room ID to join the room"
                handleContinue={() => {
                    // join a room
                    if (!roomInput) return; // if given room input is valid, do nothing.
                    checkRoomInput(roomInput);
                }}
            >
                <TextField
                    autoFocus
                    margin="dense"
                    id="room"
                    label="Room ID"
                    name="room"
                    value={roomInput}
                    required
                    onChange={(e) => setRoomInput(e.target.value)}
                    type="text"
                    fullWidth
                    variant="standard"
                    error={Boolean(roomError)}
                    helperText={
                        !roomError ? "Enter a room ID" : `Invalid room ID: ${roomError}`
                    }
                />
            </CustomDialog>
            {start === true ? <Navigate to='/game-room' state={data} replace={true}/> : null}
            {createRoom === false ? null : <div className="myModal">
                <div className="myModalOptions">
                    <h3>Game settings</h3>
                    <h3>Board size: {size}{'\u00D7'}{size}</h3>
                    <h3>Opponent: {bot === true ? <img className="gameMode" src={logo_bot} alt="Bot"/> : <img className="gameMode" src={logo_player} alt="Player"/>}</h3>
                    <div className="custom">
                        <Box textAlign='center' display='flex' justifyContent='space-between'>
                            <Button variant="contained" className="chs-btn" onClick={() => {
                                setSize(6);
                            }}>6{'\u00D7'}6</Button>
                            <Button variant="contained" className="chs-btn" onClick={() => {
                                setSize(8);
                            }}>8{'\u00D7'}8</Button>
                            <Button variant="contained" className="chs-btn" onClick={() => {
                                setSize(10);
                            }}>10{'\u00D7'}10</Button>
                        </Box><br/>
                        <Box textAlign='center' display='flex' justifyContent='space-between'>
                            <Button variant="contained" className="chs-btn" onClick={() => {
                                setBot(true);
                            }}>Player vs Bot</Button>
                            <Button variant="outlined" className="chs-btn" onClick={() => {
                                setStart(true);
                                setData({roomId: bot ? "private" : roomId, size: size, bot: bot, isFirst: isFirst});
                            }}>START A GAME</Button>
                            <Button variant="contained" className="chs-btn" onClick={() => {
                                setBot(false);
                            }}>Player vs Player</Button>
                        </Box>
                        {start === true ? <Navigate to='/game-room' state={data} replace={true}/> : null}
                    </div>
                </div>
            </div> }

            <Button variant="contained" onClick={() => {
                setRoomId(uuidV4());
                setIsFirst(true);
                setCreateRoom(true);
            }}>
                Start a game
            </Button>

            <Button variant="text" onClick={() => {setRoomDialogOpen(true);}}>
                Join a game
            </Button>
        </Stack>
    );
}
