import LocalBoard from "../LocalBoard"
import Player from "./Player"
import Instructions from "../Instructions"
import { useState } from "react"
import { Dice } from "../../utils"
import ConfettiExplosion from 'react-confetti-explosion'

export default function LocalGame() {
    const [currentDice, setCurrentDice] = useState(Dice[5])
    const [canRoll, setCanRoll] = useState(true)
    const [board1, setBoard1] = useState([[0, 0, 0], [0, 0, 0] ,[0, 0, 0]])
    const [board2, setBoard2] = useState([[0, 5, 6], [1, 6, 5] ,[1, 5, 6]])
    const [score1, setScore1] = useState(0)
    const [score2, setScore2] = useState(0)
    const [isPlayer1Turn, setIsPlayer1Turn] = useState(true)
    const [isGameOver, setIsGameOver] = useState(false)

    function rollDice() {
        if (!isGameOver) {
            fetch("http://localhost:8080/api/rolls")
                .then(response => {
                    if (response.ok) {
                        setCanRoll(false)
                        return response.json();
                    } else {
                        console.log('Request failed with status:', response.status)
                        throw new Error('Request failed')
                    }
                })
                .then(data => setCurrentDice(Dice[data.dice]))
            return
        }
        setBoard1([[0, 0, 0], [0, 0, 0], [0, 0, 0]])
        setBoard2([[0, 0, 0], [0, 0, 0], [0, 0, 0]])
        setScore1(0)
        setScore2(0)
        setIsPlayer1Turn(true)
        setIsGameOver(false)
    }

    function handlePlace(row, col) {
        fetch("http://localhost:8080/api/games/localgame", {
            method: "POST",
            body: JSON.stringify({
                board1: board1,
                board2: board2,
                turn: isPlayer1Turn ? "player1" : "player2",
                dice: Dice.indexOf(currentDice),
                row: row,
                col: col
            }),
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then(response => {
                if (response.ok) {
                    setCanRoll(true)
                    setIsPlayer1Turn(prev => !prev)
                    return response.json();
                } else {
                    console.log('Request failed with status:', response.status)
                    throw new Error('Request failed')
                }
            })
                .then(data => {
                setBoard1(data.board1),
                setBoard2(data.board2),
                setScore1(data.score1),
                setScore2(data.score2)
                setIsGameOver(data.is_over)
                setCurrentDice(Dice[5])
            })
    }

    return (
        <section className="local-play">
            {isGameOver &&
                <section className={`local-game-over ${score1 > score2 ? "top" : "bottom"}`}>
                    <ConfettiExplosion
                        duration={4000}
                        particleCount={400}
                    />
                    <h1>
                        You Won!
                    </h1>
                </section>
            }
            <Player
                player="player1"
                playerName="Guest"
                isTurn={isPlayer1Turn}
                score={score1}
            />
            <LocalBoard
                player="player1"
                place={handlePlace}
                board={board1}
                isTurn={isPlayer1Turn}
                hasRolled={!canRoll}
            />

            <section
                className={isPlayer1Turn ? "roll-top" : "roll-bottom"}
            >
                <img
                    className="roll-die"
                    src={currentDice}
                    alt="die placeholder"
                    style={{opacity: canRoll ? 0.4 : 1}}
                />
            </section>

            <section
                className={!isPlayer1Turn ? "roll-top" : "roll-bottom"}
            >
                <button
                    className="roll-button"
                    onClick={rollDice}
                    disabled={!canRoll}
                >
                    {isGameOver ? "Restart" : "Roll"}
                </button>
            </section>

            <Player
                player="player2"
                playerName="Friend"
                isTurn={!isPlayer1Turn}
                score={score2}
            />
            <LocalBoard
                player="player2"
                place={handlePlace}
                board={board2}
                isTurn={!isPlayer1Turn}
                hasRolled={!canRoll}
            />

            <Instructions />
        </section>
    )
}
