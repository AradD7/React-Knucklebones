import Board from "./Board"
import Player from "./Player"
import Instructions from "./Instructions"
import { useState } from "react"
import { Dice } from "./utils"

export default function Game() {
    const [currentDice, setCurrentDice] = useState(() => Dice[5])
    const [canRoll, setCanRoll] = useState(() => true)
    const [board1, setBoard1] = useState(() => [[0, 0, 0], [0, 0, 0] ,[0, 0, 0]])
    const [board2, setBoard2] = useState(() => [[0, 0, 0], [0, 0, 0] ,[0, 0, 0]])
    const [score1, setScore1] = useState(() => 0)
    const [score2, setScore2] = useState(() => 0)
    const [isPlayer1Turn, setIsPlayer1Turn] = useState(() => true)

    function rollDice() {
        fetch("http://localhost:8080/api/rolls")
            .then(response => {
                if (response.ok) {
                    console.log('Request to get new dice was successful!')
                    setCanRoll(false)
                    return response.json();
                } else {
                    console.log('Request failed with status:', response.status)
                    throw new Error('Request failed')
                }
            })
            .then(data => setCurrentDice(Dice[data.dice]))
    }

    function handlePlace(row, col) {
        console.log(`${col}, ${row} was presses`)
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
                    console.log('successfully placed dice!')
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
            })
    }

    return (
        <>
            <Player
                player="player1"
                playerName="Guest1"
                isTurn={isPlayer1Turn}
                score={score1}
            />
            <Board
                player="player1"
                place={handlePlace}
                board={board1}
                isTurn={isPlayer1Turn}
                hasRolled={!canRoll}
            />

            <section className="roll-die-box">
                <img className="roll-die" src={currentDice} alt="die placeholder" />
            </section>

            <section className="roll-button-box">
                <button className="roll-button" onClick={rollDice} disabled={!canRoll}>Roll</button>
            </section>

            <Player
                player="player2"
                playerName="Guest2"
                isTurn={!isPlayer1Turn}
                score={score2}
            />
            <Board
                player="player2"
                place={handlePlace}
                board={board2}
                isTurn={!isPlayer1Turn}
                hasRolled={!canRoll}
            />

            <Instructions />
        </>
    )
}
