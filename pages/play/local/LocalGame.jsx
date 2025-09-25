import LocalBoard from "../LocalBoard"
import Player from "./Player"
import Instructions from "../Instructions"
import { useRef, useState } from "react"
import { Dice } from "../../utils"
import ConfettiExplosion from 'react-confetti-explosion'
import { useOutletContext } from "react-router-dom"
import axios from "axios"

export default function LocalGame() {

    const [currentDice, setCurrentDice] = useState(Dice[5])
    const [canRoll, setCanRoll] = useState(true)
    const [board1, setBoard1] = useState([[0, 0, 0], [0, 0, 0] ,[0, 0, 0]])
    const [board2, setBoard2] = useState([[0, 0, 0], [0, 0, 0] ,[0, 0, 0]])
    const [score1, setScore1] = useState(0)
    const [score2, setScore2] = useState(0)
    const [isPlayer1Turn, setIsPlayer1Turn] = useState(true)
    const [isGameOver, setIsGameOver] = useState(false)

    const { playerInfo } = useOutletContext()

    const intervalRef = useRef(null)
    const counterRef = useRef(0)
    function rollDice() {
        if (!isGameOver) {
            setCanRoll(false)

            intervalRef.current = setInterval(() => {
                counterRef.current++
                setCurrentDice(Dice[Math.ceil(Math.random() * 6)])
            }, 100)
            const minAnimationTime = new Promise(resolve => setTimeout(resolve, 1000))

            Promise.all([
                axios.get("/rolls")
                .then(response => response.data)
                .catch(error => {
                    console.log('Roll failed:', error);
                    throw error;
                }),
                minAnimationTime
            ])
                .then(([data]) => {
                    clearInterval(intervalRef.current);
                    setCurrentDice(Dice[data.dice]);
                })
                .catch(() => {
                    clearInterval(intervalRef.current);
                    setCanRoll(true);
                })
            return;
        }
        setBoard1([[0, 0, 0], [0, 0, 0], [0, 0, 0]])
        setBoard2([[0, 0, 0], [0, 0, 0], [0, 0, 0]])
        setScore1(0)
        setScore2(0)
        setIsPlayer1Turn(true)
        setIsGameOver(false)
    }

    function handlePlace(row, col) {
        axios.post("http://localhost:8080/api/games/localgame", {
            board1: board1,
            board2: board2,
            turn: isPlayer1Turn ? "player1" : "player2",
            dice: Dice.indexOf(currentDice),
            row: row,
            col: col
        })
            .then(response => {
                const data = response.data
                setBoard1(data.board1),
                setBoard2(data.board2),
                setScore1(data.score1),
                setScore2(data.score2)
                setIsGameOver(data.is_over)
                setCurrentDice(Dice[5])
                setCanRoll(true)
                setIsPlayer1Turn(prev => !prev)
            })
            .catch(error => {
                console.log('failed to place:', error);
            });
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
                playerName={!playerInfo.displayName ? playerInfo.username : playerInfo.displayName}
                isTurn={isPlayer1Turn}
                pic={playerInfo.avatar}
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
