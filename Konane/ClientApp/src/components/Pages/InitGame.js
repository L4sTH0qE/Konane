import { Button, Stack, TextField } from "@mui/material";
import React, { useState } from "react";
import CustomDialog from "../CustomDialog";
import {Colors} from "../../models/Colors";
import logo_white from "../../assets/checkers_top_white.png";
import logo_black from "../../assets/checkers_top_black.png";
import {Navigate, useLocation} from "react-router-dom";
import {Game} from "../Game/Game";
import {Board} from "../../models/Board";
import logo_bot from "../../assets/gamemode_pve.png";
import logo_player from "../../assets/gamemode_pvp.png";
const { v4: uuidV4 } = require('uuid');

export default function InitGame() {
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
                    /*                    socket.emit("joinRoom", { roomId: roomInput }, (r) => {
                                            // r is the response from the server
                                            if (r.error) return setRoomError(r.message); // if an error is returned in the response set roomError to the error message and exit
                                            console.log("response:", r);
                                            setRoom(r?.roomId); // set room to the room ID
                                            setPlayers(r?.players); // set players array to the array of players in the room
                                            setOrientation("black"); // set orientation as black
                                            setRoomDialogOpen(false); // close dialog
                                        });*/
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
