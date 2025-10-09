import axios from "axios"
import { useEffect, useState } from "react"
import { useLocation, useNavigate, useSearchParams } from "react-router-dom"

export default function GameHistory() {
    const navigate = useNavigate()
    const location = useLocation()
    const [page, setPage] = useState(1)
    const [games, setGames] = useState([])

    useEffect(() => {
        axios.get("/games")
        .then(response => {
                setGames(response.data.sort((g1, g2) => new Date(g2.date) - new Date(g1.date)))
            })
    }, [])

    const rows = games.slice((page-1)*5, page*5).map(game => (
        <tr
            key={game.id}
            onClick={() => navigate(`/onlineplay?gameid=${game.id}`, {
                state: {previousPath: location.pathname}
            }
            )}
        >
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
                    game.status === 1 ? "You\nWon" : "You\nLost"}
            </td>
        </tr>
    ))

    function addPage() {
        if (page * 5 < games.length) {
            setPage(prev => prev + 1)
        }
    }

    function minPage() {
        if (page !== 1) {
            setPage(prev => prev - 1)
        }
    }

    return (
        <table className="game-history">
            <thead>
                <tr>
                    <th>Date</th>
                    <th>Against</th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody>
                {rows}
            </tbody>
            <tfoot>
                <tr>
                    <td></td>
                    <td></td>
                    <td>
                        <section className="pagination">
                            <h1 onClick={minPage} className={page === 1 ? "not-visible" : "visible"}>Previous</h1>
                            <h1 onClick={addPage} className={page * 5 >= games.length ? "not-visible" : "visible"}>Next</h1>
                        </section>
                    </td>
                </tr>
            </tfoot>
        </table>
    )
}
