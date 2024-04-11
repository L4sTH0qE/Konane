import React, {useEffect, useState} from 'react';
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

    useInterval(() => updateWins(), 3000)

    return (
        <>
            <div className="gray-text">
                <h1 className="white-text">Hello, {username === "" ? "stranger" : username}! Your current victories: {wins}</h1>
                <p>This site is designed to provide its visitors with the best Konane experience they could ever have in their life!</p>
                <p>To help you get started, here are descriptions of navigation links:</p>
                <ul>
                    <li><strong className="light-text">Home</strong>. This is your start page. Here you can checkout your current profile name, stats and general info about this webapp.</li>
                    <li><strong className="light-text">Rules</strong>. The page that demonstrates the history of origin and the rules of the Konane board game. It shall also include a manual in the nearest future.</li>
                    <li><strong className="light-text">Play</strong>. The page with options of creating a room for playing with the specified settings and joining an already existing room by its 'Room ID'.</li>
                </ul>
            </div>
        </>
    );
}
