import { useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"

export default function HowTo() {
    const navigate = useNavigate()
    const location = useLocation()
    const [page, setPage] = useState(1)

    function nextPage(){
        setPage(prev => prev + 1)
    }

    function prevPage() {
        setPage(prev => prev - 1)
    }
    return (
        <section className="how-to-play-section">
            {page === 1 ?
                <>
                    <h1>Game Rules</h1>
                    <h2>Overview</h2>
                    <p>
                    Knucklebones is a 2-player dice game, in which each player has a 3x3 board. In
                    each turn, player rolls a dice and places it in their board and the game is finished
                    as soon as one of the boards is full. Then, the player with the higher score wins.
                    </p>
                    <p>
                    The score is calculated by adding the dice values on the board but each repeated dice
                    in a column multiplies its value by how many times it's repeated in that column. If
                    that sounds unclear, hit next to see it in action!
                    </p>
                </> : null
            }
            <section className="buttons-tutorial">
                <h1 onClick={prevPage} className={page === 1 ? "not-visible" : "visible"}>Previous</h1>
                <h1 onClick={nextPage} className={"visible"}>Next</h1>
            </section>
        </section>
    )
}
