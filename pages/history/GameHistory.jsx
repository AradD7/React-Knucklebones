import axios from "axios"
import { useEffect, useState } from "react"

export default function GameHistory() {
    const [games, setGames] = useState([])

    useEffect(() => {
        axios.get("/games")
        .then(response => {
                setGames(response.data.sort((g1, g2) => Date(g1.date) > Date(g2.date) ? -1 : 1))
            })
    }, [])

    const rows = games.map(game => (
        <tr key={game.id}>
            <td className="time-column"> {new Date(game.date).toLocaleString('en-US', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
                hour: 'numeric',
                minute: '2-digit',
                second: "2-digit",
                hour12: true
            })} </td>
            <td className="name-column"> {game.opp_name} </td>
            <td className={`status ${game.status === 1 ? "status-won" :
                            game.status === -1 ? "status-lost" : ""}`}>
                {game.status === 0 ? "In Progress" :
                    game.status === 1 ? "You Won" : "You Lost"}
            </td>
        </tr>
    ))

    console.log(games)
    return (
        <table className="game-history">
            <thead>
                <tr>
                    <th> Date </th>
                    <th> Against </th>
                    <th> Status </th>
                </tr>
            </thead>
            <tbody>
                {rows}
            </tbody>
        </table>
    )
}
