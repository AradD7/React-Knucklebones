import { useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import BoardPage2 from "./BoardPage2"
import BoardPage3 from "./BoardPage3"
import BoardPage4 from "./BoardPage4"

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
                    Knucklebones is a 2-player dice game in which each player has a 3x3 board. Each turn,
                    the player rolls a dice and places it in their board. The game is finished as soon as one
                    of the boards is full and the player with the higher score wins!
                    </p>
                    <p>
                    The score is calculated by adding the dice values on the board, but each repeated dice
                    in a column multiplies its value by how many times it's repeated. Hit next to see it
                    in action!
                    </p>
                </> : null
            }

            {page === 2 ? <BoardPage2 /> : null}
            {page === 3 ? <BoardPage3 /> : null}
            {page === 4 ? <BoardPage4 /> : null}

            <section className="buttons-tutorial">
                <h1 onClick={prevPage} className={page === 1 ? "not-visible" : "visible"}>Previous</h1>
                <h1 onClick={nextPage} className={page === 4 ? "not-visible" : "visible"}>Next</h1>
            </section>
        </section>
    )
}
