import {Box, Button, Stack} from "@mui/material";
import React, { useState } from "react";
import CustomDialog from "../CustomDialog";
import CustomTextField from "../CustomTextField";
import {Navigate} from "react-router-dom";
import logo_bot from "../../assets/bot.png";
import logo_player from "../../assets/player.png";
import logo_white from "../../assets/checkers_top_white.png";
import logo_black from "../../assets/checkers_top_black.png";
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
    const [selectedBtnFirst, setSelectedBtnFirst] = React.useState(2);
    const [selectedBtnSecond, setSelectedBtnSecond] = React.useState(2);
    const [selectedBtnThird, setSelectedBtnThird] = React.useState(2);

    function getRoom(roomId) {
        return fetch('/room/' + roomId)
            .then((response)=>response.json())
            .then((responseJson)=>{return responseJson})
            .catch(() => {return "No room with such ID";});
    }

    async function checkRoomInput(roomInput) {
        const json = await getRoom(roomInput);  // command waits until completion
        if (json === "No room with such ID") {
            setRoomError("No room with such ID");
        } else if (json.status === "Finished") {
            setRoomError("Room with such ID is closed");
        } else if (json.status === "Active") {
            setRoomError("Room with such ID is active");
        } else if (json.status === "Waiting" && (json.firstPlayer === props.username || json.secondPlayer === props.username)) {
            setRoomError("You have already joined this room");
        } else {
            setData({roomId: roomInput, size: size, bot: bot, isFirst: isFirst});
            setRoomDialogOpen(false); // close dialog
            setStart(true);
        }
    }

    return (
        <>
            <Stack
                justifyContent="center"
                alignItems="center"
                sx={{ py: 1, height: "90vh" }}
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
                    <CustomTextField
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
                {createRoom === false ? null :
                    <div className="myModal">
                        <div className="myModalOptions">
                            <h3>Game settings</h3>
                            <h3>Board size: {size}{'\u00D7'}{size}</h3>
                            <div>
                                <Box textAlign='center' display='flex' justifyContent='space-around'>
                                    <Button className="chs-btn" sx = {{color: '#cda88b', backgroundColor: selectedBtnFirst === 1 ? '#202020' : '#404040', "&:hover": {color: '#b28c6e', backgroundColor: selectedBtnFirst === 1 ? '#191919' : '#393939'}}} variant="text" onClick={() => {
                                        setSelectedBtnFirst(1);
                                        setSize(6);
                                    }}>6{'\u00D7'}6</Button>
                                    <Button className="chs-btn" sx = {{color: '#cda88b', backgroundColor: selectedBtnFirst === 2 ? '#202020' : '#404040', "&:hover": {color: '#b28c6e', backgroundColor: selectedBtnFirst === 2 ? '#191919' : '#393939'}}} variant="text" onClick={() => {
                                        setSelectedBtnFirst(2);
                                        setSize(8);
                                    }}>8{'\u00D7'}8</Button>
                                    <Button className="chs-btn" sx = {{color: '#cda88b', backgroundColor: selectedBtnFirst === 3 ? '#202020' : '#404040', "&:hover": {color: '#b28c6e', backgroundColor: selectedBtnFirst === 3 ? '#191919' : '#393939'}}} variant="text" onClick={() => {
                                        setSelectedBtnFirst(3);
                                        setSize(10);
                                    }}>10{'\u00D7'}10</Button>
                                </Box>
                            </div>
                            <br/>
                            <h3>Opponent: {bot === true ? <img className="gameMode" src={logo_bot} alt="Bot"/> : <img className="gameMode" src={logo_player} alt="Player"/>}</h3>
                            <div>
                                <Box textAlign='center' display='flex' justifyContent='space-around'>
                                    <Button className="chs-btn" sx = {{color: '#cda88b', backgroundColor: selectedBtnSecond === 1 ? '#202020' : '#404040', "&:hover": {color: '#b28c6e', backgroundColor: selectedBtnSecond === 1 ? '#191919' : '#393939'}}} variant="text" onClick={() => {
                                        setSelectedBtnSecond(1);
                                        setBot(true);
                                    }}>Player vs Bot</Button>
                                    <Button className="chs-btn" sx = {{color: '#cda88b', backgroundColor: selectedBtnSecond === 2 ? '#202020' : '#404040', "&:hover": {color: '#b28c6e', backgroundColor: selectedBtnSecond === 2 ? '#191919' : '#393939'}}} variant="text" onClick={() => {
                                        setSelectedBtnSecond(2);
                                        setBot(false);
                                    }}>Player vs Player</Button>
                                </Box>
                            </div>
                            <br/>
                            <h3>Side (black starts first): {isFirst === true ? <img className="gameMode" src={logo_black} alt="Black"/> : <img className="gameMode" src={logo_white} alt="White"/>}</h3>
                            <div>
                                <Box textAlign='center' display='flex' justifyContent='space-around'>
                                    <Button className="chs-btn" sx = {{color: '#cda88b', backgroundColor: selectedBtnThird === 1 ? '#202020' : '#404040', "&:hover": {color: '#b28c6e', backgroundColor: selectedBtnThird === 1 ? '#191919' : '#393939'}}} variant="text" onClick={() => {
                                        setSelectedBtnThird(1);
                                        setIsFirst(false);
                                    }}>White</Button>
                                    <Button className="chs-btn" sx = {{color: '#cda88b', backgroundColor: selectedBtnThird === 2 ? '#202020' : '#404040', "&:hover": {color: '#b28c6e', backgroundColor: selectedBtnThird === 2 ? '#191919' : '#393939'}}} variant="text" onClick={() => {
                                        setSelectedBtnThird(2);
                                        setIsFirst(true);
                                    }}>Black</Button>
                                </Box>
                            </div>
                            <br/>
                            <br/>
                            <h3></h3>
                            <div>
                                <Box textAlign='center' display='flex' justifyContent='center'>
                                    <Button className="sgn-btn" sx = {{color: '#cda88b', backgroundColor: '#202020', "&:hover": {color: '#b28c6e', backgroundColor: '#191919'}}} variant="text" onClick={() => {
                                        setStart(true);
                                        setData({roomId: bot ? "private" : roomId, size: size, bot: bot, isFirst: isFirst});
                                    }}>START A GAME</Button>
                                </Box>
                                {start === true ? <Navigate to='/game-room' state={data} replace={true}/> : null}
                            </div>
                        </div>
                    </div>
                }

                <Button className="sgn-btn" sx = {{color: '#cda88b', backgroundColor: '#202020', "&:hover": {color: '#b28c6e', backgroundColor: '#191919'}}} variant="text" onClick={() => {
                    setRoomId(uuidV4());
                    setCreateRoom(true);
                }}>
                    Create room
                </Button>
                <br/>
                <Button className="sgn-btn" sx = {{color: '#cda88b', backgroundColor: '#202020', "&:hover": {color: '#b28c6e', backgroundColor: '#191919'}}} variant="text" onClick={() => {setRoomDialogOpen(true);}}>
                    Join room
                </Button>
            </Stack>
        </>
    );
}
