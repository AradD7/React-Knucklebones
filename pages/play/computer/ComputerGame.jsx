import { useEffect, useState } from "react"
import { Dice, RandomInt } from "../../utils"
import LocalBoard from "../LocalBoard"
import Player from "./Player"
import Instructions from "../Instructions"
import ConfettiExplosion from 'react-confetti-explosion'
import { useOutletContext } from "react-router-dom"

export default function ComputerGame() {
    const [currentDice, setCurrentDice] = useState(Dice[5])
    const [canRoll, setCanRoll] = useState(true)
    const [board1, setBoard1] = useState([[0, 6, 6], [6, 6, 6] ,[6, 6, 6]])
    const [board2, setBoard2] = useState([[0, 0, 0], [0, 0, 0] ,[0, 0, 0]])
    const [nextBoard1, setNextBoard1] = useState([[0, 0, 0], [0, 0, 0] ,[0, 0, 0]])
    const [nextBoard2, setNextBoard2] = useState([[0, 0, 0], [0, 0, 0] ,[0, 0, 0]])
    const [score1, setScore1] = useState(0)
    const [score2, setScore2] = useState(0)
    const [nextScore1, setNextScore1] = useState(0)
    const [nextScore2, setNextScore2] = useState(0)
    const [isComputerTurn, setIsComputerTurn] = useState(false)
    const [isGameOver, setIsGameOver] = useState(false)
    const [isGameOverNext, setIsGameOverNext] = useState(false)

    const { playerInfo } = useOutletContext()

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
        setIsComputerTurn(false)
        setIsGameOver(false)
    }

    useEffect(() => {
        if (isComputerTurn) {
            if (score1 === 0 && score2 === 0 && nextScore1 === 0 && nextScore2 === 0) {
                setBoard2(() => {
                    const initBoard = [[0, 0, 0], [0, 0, 0], [0, 0, 0]]
                    initBoard[0][RandomInt(3)] = RandomInt(1, 7)
                    return initBoard
                })
            }
        } else if (!isGameOver){
            const timer = setTimeout(() => {
                setBoard1(nextBoard1)
                setBoard2(nextBoard2)
                setScore1(nextScore1)
                setScore2(nextScore2)
                setIsComputerTurn(false)
                setIsGameOver(isGameOverNext)
                setCanRoll(true)
            }, 2000)
            return () => clearTimeout(timer)
        }
    }, [nextBoard2])

    function handlePlace(row, col) {
        fetch("http://localhost:8080/api/games/computergame", {
            method: "POST",
            body: JSON.stringify({
                board1: board1,
                board2: board2,
                dice: Dice.indexOf(currentDice),
                row: row,
                col: col,
                diffuclty: "hard"
            }),
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    console.log('Request failed with status:', response.status)
                    throw new Error('Request failed')
                }
            })
                .then(data => {
                console.log(data)
                setBoard1(data.board1),
                setBoard2(data.board2),
                setNextBoard1(data.next_board1),
                setNextBoard2(data.next_board2),
                setScore1(data.score1),
                setScore2(data.score2)
                setNextScore1(data.next_score1),
                setNextScore2(data.next_score2)
                setIsGameOver(data.is_over)
                setIsGameOverNext(data.is_over_next)
                setCurrentDice(Dice[5])
            })
    }

    return (
        <section className="local-play">
            {isGameOver && (score1 > score2 ?
                <>
                    <ConfettiExplosion
                        style={{position: "absolute", top: "20%", left: "50%"}}
                        duration={4000}
                        particleCount={400}
                    />
                    <h1 className="game-over-text">
                        You Won!
                    </h1>
                </> :
                <>
                    <h1 className="game-over-text game-lost-text">
                        You Lost!
                    </h1>
                </>
            )}
            <Player
                player="player1"
                playerName={!playerInfo.displayName ? playerInfo.username : playerInfo.displayName}
                isTurn={!isComputerTurn}
                score={score1}
            />
            <LocalBoard
                player="player1"
                place={handlePlace}
                board={board1}
                isTurn={!isComputerTurn}
                hasRolled={!canRoll}
            />

            <section
                className="roll-top"
            >
                <img
                    className="roll-die"
                    src={currentDice}
                    alt="die placeholder"
                    style={{opacity: canRoll ? 0.4 : 1}}
                />
            </section>

            <section
                className="roll-bottom"
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
                playerName="Computer"
                isTurn={isComputerTurn}
                score={score2}
            />
            <LocalBoard
                player="player2"
                place={handlePlace}
                board={board2}
                isTurn={isComputerTurn}
                hasRolled={true}
            />

            <Instructions />
        </section>
    )
}
