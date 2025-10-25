import { useRef, useState } from "react"
import { Dice } from "../utils"

export default function BoardPage3() {
    const isDisabled1 = new Array(9).fill(true)
    const colBlocked1 = new Array(3).fill(false)
    const isHighlighted1 = [[false, false, false], [false, false, false], [false, false, false]]
    const isHighlighted2 = [[false, false, false], [false, false, false], [false, false, false]]
    const [board1, setBoard1] = useState([[3, 1, 0], [4, 5, 0], [3, 5, 2]])
    const [board2, setBoard2] = useState([[6, 0, 0], [1, 0, 4], [6, 2, 4]])
    const [score1, setScore1] = useState(38)
    const [score2, setScore2] = useState(43)
    const [currentDice, setCurrentDice] = useState(Dice[5])
    const [paragraph, setParagraph] = useState(["Your opponent's board sits below yours and will fill from top to bottom.",
        "Placing a die in a column will eliminate all of your opponent's same-value dice in the same column (and vice versa).",
        "Roll and place the dice to see how your opponent's board changes."
    ])
    const [hasRolled, setHasRolled] = useState(false)
    const [canPlace, setCanPlace] = useState(false)
    const intervalRef = useRef(null)

    function animateDiceRoll(finalRoll) {
        // Clear any existing interval first
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }

        // Start animation
        intervalRef.current = setInterval(() => {
            setCurrentDice(Dice[Math.ceil(Math.random() * 6)]);
        }, 100);

        // Stop after 800ms
        setTimeout(() => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
            setCurrentDice(Dice[finalRoll]);
            setCanPlace(true)
        }, 800);
    }

    function handlePlace(row, col) {
        setBoard1(arr => {
            const copy = [...arr]
            copy[row][col] = 4
            return copy
        })
        setBoard2(arr => {
            const copy = [...arr]
            copy[1][col] = 0
            copy[2][col] = 0
            return copy
        })
        setParagraph(["Yayy! This is a great way to increase the score gap with your opponent!",
            "Hit next to see how the game ends."])
        setScore1(42)
        setScore2(27)
        setCanPlace(false)
    }

    for (let col = 0; col < 3; col++) {
        if ((board1[2][col] === board1[1][col]) && (board1[2][col] === board1[0][col])) {
            isHighlighted1[2][col] = true
            isHighlighted1[1][col] = true
            isHighlighted1[0][col] = true
        } else if (board1[2][col] === board1[1][col]) {
            isHighlighted1[2][col] = true
            isHighlighted1[1][col] = true
        } else if (board1[2][col] === board1[0][col]) {
            isHighlighted1[2][col] = true
            isHighlighted1[0][col] = true
        } else if (board1[1][col] === board1[0][col]) {
            isHighlighted1[1][col] = true
            isHighlighted1[0][col] = true
        }
    }

    if (canPlace) {
        for (let row = 2; row >=0; row--) {
            for (let col = 0; col < 3; col++) {
                if (board1[row][col] == 0 && !colBlocked1[col]) {
                    isDisabled1[(row * 3) + col] = false
                    colBlocked1[col] = true
                }
            }
        }
    }
    const buttons1 = board1.map((row, indexR) =>
        row.map((col, indexC) => {
            const key = indexC + (indexR * 3)
            return (
                <button
                    key={key}
                    disabled={isDisabled1[key]}
                    onClick={() => handlePlace(indexR, indexC)}
                    style={{backgroundColor: isHighlighted1[indexR][indexC] && Dice[col] ? "#EA7159" : null}}
                >
                    <img
                        src={Dice[col]}
                        alt={Dice[col] === null ? null : `die of value ${col}`}
                    />
                </button>)
        }
        ))

    for (let col = 0; col < 3; col++) {
        if ((board2[0][col] === board2[1][col]) && (board2[0][col] === board2[2][col])) {
            isHighlighted2[0][col] = true
            isHighlighted2[1][col] = true
            isHighlighted2[2][col] = true
        } else if (board2[0][col] === board2[1][col]) {
            isHighlighted2[0][col] = true
            isHighlighted2[1][col] = true
        } else if (board2[0][col] === board2[2][col]) {
            isHighlighted2[0][col] = true
            isHighlighted2[2][col] = true
        } else if (board2[1][col] === board2[2][col]) {
            isHighlighted2[1][col] = true
            isHighlighted2[2][col] = true
        }
    }
    const buttons2 = board2.toReversed().map((row, indexR) =>
        row.map((col, indexC) => {
            const key = indexC + (indexR * 3)
            return (
                <button
                    key={key}
                    disabled={true}
                    style={{backgroundColor: isHighlighted2[2-indexR][indexC] && Dice[col] ? "#EA7159" : null}}
                >
                    <img
                        src={Dice[col]}
                        alt={Dice[col] === null ? null : `die of value ${col}`}
                    />
                </button>)
        }
        ))

    function handleRoll() {
        setHasRolled(true)
        animateDiceRoll(4)
    }

    const paragraphElements = paragraph.map((para, idx) => <p key={idx} className="board-paragraph">{para}</p>)

    return (
        <>
            <section className="tutorial-page2">
                {paragraphElements}
                <section className="tutorial1-section">
                    <section className={"tutorial1-board"}>
                        {buttons1}
                    </section>
                    <section className="score-dice-roll-section">
                        <section className="tutorial-score-two-boards">
                            <div className="tutorial-score-div tutorial-score1">{score1}</div>
                            <div className="tutorial-score-div tutorial-score2">{score2}</div>
                        </section>
                        <img
                            className="tutorial-dice"
                            src={currentDice}
                            alt="die placeholder"
                            style={{opacity: hasRolled ? 1 : 0.5}}
                        />
                        <button
                            className="tutorial-roll-button"
                            onClick={handleRoll}
                            disabled={hasRolled}
                            style={{opacity: !hasRolled ? 1 : 0.5}}
                        >
                            Roll
                        </button>
                    </section>
                    <section className={"tutorial1-board"}>
                        {buttons2}
                    </section>
                </section>
            </section>
        </>
    )
}
