import React from 'react';
import {useLocation} from "react-router-dom";
import "./Pages.css"
import Game from "../Game/Game";

const GameOptions = (props) => {
    const location = useLocation();
    console.log(location.state);

    return (
        <>
            { location.state === null ? <></> : 
            <Game 
                size={location.state.size} 
                roomId={location.state.roomId} 
                isBot={location.state.bot} 
                name={props.username} 
                isFirst={location.state.isFirst}
            /> }
        </>
    );
};

export default GameOptions;
