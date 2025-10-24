import { useEffect, useRef, useState } from "react"
import { Dice } from "../utils"

export default function BoardPage2() {
    const isDisabled = new Array(9).fill(true)
    const colBlocked = new Array(3).fill(false)
    const isHighlighted = [[false, false, false], [false, false, false], [false, false, false]]
    const [board, setBoard] = useState([[0, 0, 0], [0, 0, 0], [0, 0, 0]])
    const [score, setScore] = useState(0)
    const [currentDice, setCurrentDice] = useState(Dice[5])
    const [subPage, setSubPage] = useState(0)
    const [paragraph, setParagraph] = useState("Your board needs to be filled from the bottom. Roll the dice and place it in one of the highlighted cells")
    const [singleDiceValue] = useState(Math.ceil(Math.random() * 3))
    const [dupDiceValue] = useState(Math.ceil(Math.random() * 3) + 3)
    const [hasRolled, setHasRolled] = useState(false)
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
        switch (subPage) {
            case 0:
                setBoard(arr => {
                    const copy = [...arr]
                    copy[row][col] = singleDiceValue
                    return copy
                })
                break
            default:
                setBoard(arr => {
                    const copy = [...arr]
                    copy[row][col] = dupDiceValue
                    return copy
                })
        }
        setSubPage(prev => prev + 1)
        setHasRolled(false)
    }

    for (let col = 0; col < 3; col++) {
        if ((board[2][col] === board[1][col]) && (board[2][col] === board[0][col])) {
            isHighlighted[2][col] = true
            isHighlighted[1][col] = true
            isHighlighted[0][col] = true
        } else if (board[2][col] === board[1][col]) {
            isHighlighted[2][col] = true
            isHighlighted[1][col] = true
        } else if (board[2][col] === board[0][col]) {
            isHighlighted[2][col] = true
            isHighlighted[0][col] = true
        } else if (board[1][col] === board[0][col]) {
            isHighlighted[1][col] = true
            isHighlighted[0][col] = true
        }
    }

    if (hasRolled) {
        for (let row = 2; row >=0; row--) {
            for (let col = 0; col < 3; col++) {
                if (board[row][col] == 0 && !colBlocked[col]) {
                    isDisabled[(row * 3) + col] = false
                    colBlocked[col] = true
                }
            }
        }
    }
    const buttons = board.map((row, indexR) =>
        row.map((col, indexC) => {
            const key = indexC + (indexR * 3)
            return (
                <button
                    key={key}
                    disabled={isDisabled[key]}
                    onClick={() => handlePlace(indexR, indexC)}
                    style={{backgroundColor: isHighlighted[indexR][indexC] && Dice[col] ? "#EA7159" : null}}
                >
                    <img
                        src={Dice[col]}
                        alt={Dice[col] === null ? null : `die of value ${col}`}
                    />
                </button>)
        }
        ))

    useEffect(() => {
        switch (subPage) {
            case 1:
                setParagraph("Great! Now roll again and place the dice in another empty column")
                break
            case 2:
                setParagraph("Nice! This time, roll and put the dice in the column that already has the same value and watch how the score changes.")
                break
            case 3:
                setParagraph(`Did you catch that? Your score wasn't just increased by ${dupDiceValue} but it increased by ${dupDiceValue * 3}! Here is how it was calculated: (${dupDiceValue} + ${dupDiceValue}) x 2 + ${singleDiceValue}. Roll one more time and place it in the same column.`)
                break
            case 4:
                setParagraph(`Awesome! This time your score was inscreased by ${dupDiceValue * 5}! It was calculated by: (${dupDiceValue} + ${dupDiceValue} + ${dupDiceValue}) x 3 + ${singleDiceValue}, since you have three ${dupDiceValue}'s in a single column. Hit next to see your board against your opponent's board`)
                break
        }
    }, [subPage])

    function handleRoll() {
        setHasRolled(true)
        switch (subPage) {
            case 0:
                animateDiceRoll(singleDiceValue)
                break
            case 1:
                animateDiceRoll(dupDiceValue)
                break
            case 2:
                animateDiceRoll(dupDiceValue)
                break
            case 3:
                animateDiceRoll(dupDiceValue)
                break
        }
    }

    useEffect(() => {
        switch (subPage) {
            case 1:
                setScore(prev => prev + singleDiceValue)
                break
            case 2:
                setScore(prev => prev + dupDiceValue)
                break
            case 3:
                setScore(prev => prev + (dupDiceValue * 3))
                break
            case 4:
                setScore(prev => prev + (dupDiceValue * 5))
                break
        }
    }, [board])

    console.log(subPage)
    return (
        <>
            <section className="tutorial-page2">
                <p className="board-paragraph">
                    {paragraph}
                </p>
                <section className="tutorial1-section">
                    <section className={subPage === 0 ? "tutorial1-board highlight-bottom" : "tutorial1-board"}>
                        {buttons}
                    </section>
                    <section className="score-dice-roll-section">
                        <section className="tutorial-score">{score}</section>
                        <img
                            className="tutorial-dice"
                            src={currentDice}
                            alt="die placeholder"
                            style={{opacity: hasRolled ? 1 : 0.5}}
                        />
                        <button
                            className="tutorial-roll-button"
                            onClick={handleRoll}
                            disabled={hasRolled || subPage > 3}
                            style={{opacity: !hasRolled && subPage <= 3 ? 1 : 0.5}}
                        >
                            Roll
                        </button>
                    </section>
                </section>
            </section>
        </>
    )
}
