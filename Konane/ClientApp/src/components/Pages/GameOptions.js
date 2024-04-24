import React from 'react';
import {useLocation} from "react-router-dom";
import "./Pages.css"
import Game from "../Game/Game";

/**
 * Functional component that describes game start.
 */
const GameOptions = (props) => {
    const location = useLocation();

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
