import React, {useEffect, useState} from 'react';
import useInterval from "../useInterval";

/**
 * Functional component that describes Home page.
 */
export default function Home (props) {
    const [username, setUsername] = useState("");
    const [wins, setWins] = useState(0);

    useEffect(() => {
        setUsername(props.username);
        setWins(props.wins);
    }, [props.username]);

    /**
     * Function to update total number of user victories.
     */
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
            <div className="gray-text">
                <h1 className="white-text">Hello, {username === "" ? "stranger" : username}! Your current victories: {wins}</h1>
                <p>This site is designed to provide its visitors with the best Konane experience they could ever have in their life!</p>
                <p>To help you get started, here are the descriptions of navigation links:</p>
                <ul>
                    <li><strong className="light-text">Home</strong>. This is your start page. Here you can checkout your current profile name, stats and general info about this webapp.</li>
                    <li><strong className="light-text">Rules</strong>. The page that demonstrates the history of origin and the rules of the Konane board game. It shall also include a manual in the nearest future.</li>
                    <li><strong className="light-text">Play</strong>. The page with options of creating a room for playing with the specified settings and joining an already existing room by its 'Room ID'.</li>
                </ul>
            </div>
            <div className="game-info">
                <h1 className="white-text game-table-title">Game information</h1>
                <table className='game-table'>
                    <thead>
                    <tr>
                        <th>Age rating</th>
                        <th>Players</th>
                        <th>Genres</th>
                        <th>Game duration</th>
                        <th>Release date</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td>0+</td>
                        <td>2</td>
                        <td>Abstract strategy game</td>
                        <td>{'\u2248'} 9 mins</td>
                        <td>02.04.2024</td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </>
    );
}
