import { useState } from "react"
import { Dice } from "../utils"

export default function BoardPage2(props) {
    const [board, setBoard] = useState([[0, 0, 0], [0, 0, 0], [0, 0, 0]])
    const [score, setScore] = useState(0)
    const [currentDice, setCurrentDice] = useState(Dice[5])

    function handlePlace(row, col) {
        setBoard(arr => {
            const copy = [...arr]
            copy[row][col] = 5
            return copy
        })
    }

    const buttons = board.map((row, indexR) =>
        row.map((col, indexC) => {
            const key = indexC + (indexR * 3)
            return (
                <button
                    key={key}
                    onClick={() => handlePlace(indexR, indexC)}
                >
                    <img
                        src={Dice[col]}
                        alt={Dice[col] === null ? null : `die of value ${col}`}
                    />
                </button>)
        }
        ))

    return (
        <section className="tutorial1-section">
            <section className={`tutorial1-board`}>
                {buttons}
            </section>
            <section className="score-dice-roll-section">
                <section className="tutorial-score">{score}</section>
                <img
                    className="tutorial-dice"
                    src={currentDice}
                    alt="die placeholder"
                />
                <button
                    className="tutorial-roll-button"
                >
                Roll
                </button>
            </section>
        </section>
    )
}
