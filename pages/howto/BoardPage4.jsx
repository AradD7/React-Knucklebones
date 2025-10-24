import { useRef, useState } from "react"
import { Dice } from "../utils"

export default function BoardPage4() {
    const isDisabled1 = new Array(9).fill(true)
    const colBlocked1 = new Array(3).fill(false)
    const isHighlighted1 = [[false, false, false], [false, false, false], [false, false, false]]
    const isHighlighted2 = [[false, false, false], [false, false, false], [false, false, false]]
    const [board1, setBoard1] = useState([[2, 0, 1], [6, 2, 3], [2, 4, 3]])
    const [board2, setBoard2] = useState([[0, 0, 6], [5, 0, 2], [1, 5, 6]])
    const [score1, setScore1] = useState(33)
    const [score2, setScore2] = useState(37)
    const [nextDice] = useState(Math.ceil(Math.random() * 6))
    const [currentDice, setCurrentDice] = useState(Dice[5])
    const [paragraph, setParagraph] = useState(["The game ends when either board is full and the player with the higher score wins!",
        "Test your luck by rolling and placing the dice to finish the game"])
    const [hasRolled, setHasRolled] = useState(false)
    const [gameStatus, setGameStatus] = useState("pending")
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
        }, 800);
    }

    function handlePlace(row, col) {
        const winParagraphs = ["Congratulations! 🎉🎉",
            "You've finished the tutorial. Hit the button to return to main menu and enjoy the game!"
        ]
        const lostParagraph = ["That's okay! This was only the tutorial.",
            "Hit the button to try luck again in an actual game!"
        ]

        setBoard1(arr => {
            const copy = [...arr]
            copy[row][col] = nextDice
            return copy
        })
        switch (nextDice) {
            case 1:
            case 3:
                setGameStatus("lost")
                setParagraph(lostParagraph)
                break
            case 5:
                setBoard2(arr => {
                    const copy = [...arr]
                    copy[2][col] = 0
                    return copy
                })
                setGameStatus("win")
                setParagraph(winParagraphs)
                break
            case 2:
            case 4:
            case 6:
                setGameStatus("win")
                setParagraph(winParagraphs)
                break
        }
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

    if (hasRolled) {
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
        animateDiceRoll(nextDice)
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
