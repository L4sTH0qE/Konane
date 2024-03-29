import React, {Component} from 'react';
import "./Game.css"
import {Game} from "./Game";
import { Container, TextField } from "@mui/material"
import CustomDialog from "./CustomDialog";
import {useLocation} from "react-router-dom";

const GameOptions = () => {
    const location = useLocation();
    console.log(location.state);
    
    return (
        <>
            <Game size={location.state.size} roomId={location.state.roomId} bot={location.state.bot} name={location.state.name} isFirst={location.state.isFirst}/>
        </>
    );
};

export default GameOptions;
