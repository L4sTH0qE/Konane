import { Button, Stack, TextField } from "@mui/material";
import React, { useState } from "react";
import CustomDialog from "../CustomDialog";
import {Navigate} from "react-router-dom";
import logo_bot from "../../assets/gamemode_pve.png";
import logo_player from "../../assets/gamemode_pvp.png";
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
                    <h3>Board size: {size}x{size} {'\u00A0'} Opponent: {bot === true ? <img src={logo_bot} alt="Bot"/> : <img src={logo_player} alt="Player"/>}</h3>
                    <div className="custom">
                        <button className="btn btn-primary chs-btn-left" onClick={() => {
                            setSize(6);
                        }}>6x6</button>
                        <button className="btn btn-primary chs-btn-center" onClick={() => {
                            setSize(8);
                        }}>8x8</button>
                        <button className="btn btn-primary chs-btn-right" onClick={() => {
                            setSize(10);
                        }}>10x10</button><br/><br/>
                        <button className="btn btn-primary chs-btn-left" onClick={() => {
                            setBot(true);
                        }}>Player vs Bot</button>
                        <button className="btn btn-primary chs-btn-center" onClick={() => {
                            setStart(true);
                            setData({roomId: roomId, size: size, bot: bot, isFirst: isFirst});
                        }}>START A GAME</button>
                        <button className="btn btn-primary chs-btn-right" onClick={() => {
                            setBot(false);
                        }}>Player vs Player</button><br/><br/>
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

            <Button onClick={() => {setRoomDialogOpen(true);}}>
                Join a game
            </Button>
        </Stack>
    );
}
