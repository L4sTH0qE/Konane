import React, {Component, useEffect, useState} from 'react';
import useInterval from "../useInterval";

export default function Home (props) {
    const [username, setUsername] = useState("");
    const [wins, setWins] = useState(0);

    useEffect(() => {
        setUsername(props.username);
        setWins(props.wins);
    }, [props.username]);

    async function updateWins() {
        try {
            const response = await fetch('/user/' + username);
            const user = await response.json();
            if (username !== props.username || wins !== user.wins) {
                setUsername(user.name);
                setWins(user.wins);
                console.log("WinsUpdate");
            }
        } catch (error) {
            console.error('Failed to fetch data:', error);
        }
    }

    useInterval(() => updateWins(), 5000)

    return (
        <>
            <h1>Hello, {username === "" ? "stranger" : username}! Your victories: {wins}</h1>
            <p>This site is designed to provide its visitors with the best Konane experience they could ever have in their life!</p>
            <p>To help you get started, here are descriptions of navigation links:</p>
            <ul>
                <li><strong>Home</strong>. This is your start page. Here you can checkout your current profile name, stats and general info about this webapp.</li>
                <li><strong>Rules</strong>. The page that demonstrates the history of origin and the rules of the Konane board game. It shall also include a manual in the nearest future.</li>
                <li><strong>Play</strong>. The page with options of creating a room for playing with the specified settings and joining an already existing room by its 'Room ID'.</li>
            </ul>
        </>
    );
}
