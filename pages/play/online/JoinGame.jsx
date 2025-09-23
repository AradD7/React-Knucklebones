import Board from "./Board"
import Player from "./Player"
import Instructions from "../Instructions"
import { useState, useEffect } from "react"
import { Dice } from "../../utils"
import useWebSocket, { ReadyState } from "react-use-websocket"
import { useNavigate, useSearchParams } from "react-router-dom"
import ConfettiExplosion from 'react-confetti-explosion'

export default function OnlineGame() {
    const [searchParams] = useSearchParams()
    const navigate = useNavigate()
    const gameId = searchParams.get("gameid")

    const [currentDice, setCurrentDice] = useState(() => Dice[5])
    const [canRoll, setCanRoll] = useState(() => false)
    const [board1, setBoard1] = useState(() => [[0, 0, 0], [0, 0, 0] ,[0, 0, 0]])
    const [board2, setBoard2] = useState(() => [[0, 0, 0], [0, 0, 0] ,[0, 0, 0]])
    const [score1, setScore1] = useState(() => 0)
    const [score2, setScore2] = useState(() => 0)
    const [isPlayer1Turn, setIsPlayer1Turn] = useState(() => false)
    const [isGameOver, setIsGameOver] = useState(() => false)

    const socketUrl = `ws://localhost:8080/ws/games/${gameId}`

    const token = localStorage.getItem("token")

    const { sendJsonMessage, readyState } = useWebSocket(socketUrl, {
        onOpen: () => {
            sendJsonMessage({
                type: "auth",
                token: token
            })
        },
        onMessage: (event) => {
            if (JSON.parse(event.data).type === "refresh") {
                fetch(`http://localhost:8080/api/games/${gameId}`, {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                })
                .then(response => {
                        if (response.ok) {
                            return response.json();
                        }
                    })
                .then(data => {
                        setBoard1(data.board1)
                        setBoard2(data.board2)
                        setScore1(data.score1)
                        setScore2(data.score2)
                        setIsGameOver(data.is_over)
                        setCurrentDice(Dice[5])
                        setIsPlayer1Turn(data.is_turn)
                        setCanRoll(data.is_turn)
                    })
            }
        }
    });

    useEffect(() => {
        fetch(`http://localhost:8080/api/games/${gameId}/join`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        })
        .then(response => {
                if (response.ok) {
                    return response.json();
                }
            })
        .then(data => {
                setScore1(data.score1)
                setScore2(data.score2)
                setIsGameOver(data.is_over)
                setCurrentDice(Dice[5])
                setIsPlayer1Turn(data.is_turn)
                setCanRoll(data.is_turn)
            })
    }, [])

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
        navigate("/onlineplay")
    }

    function handlePlace(row, col) {
        fetch(`http://localhost:8080/api/games/move/${gameId}`, {
            method: "POST",
            body: JSON.stringify({
                dice: Dice.indexOf(currentDice),
                row: row,
                col: col
            }),
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
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
                setBoard1(data.board1)
                setBoard2(data.board2)
                setScore1(data.score1)
                setScore2(data.score2)
                setIsGameOver(data.is_over)
                setCurrentDice(Dice[5])
            })
    }

    const connectionStatus = {
        [ReadyState.CONNECTING]: 'Connecting',
        [ReadyState.OPEN]: 'Open',
        [ReadyState.CLOSING]: 'Closing',
        [ReadyState.CLOSED]: 'Closed',
        [ReadyState.UNINSTANTIATED]: 'Uninstantiated',
    }[readyState];

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
                playerName="Guest1"
                score={score1}
            />
            <Board
                player="player1"
                place={handlePlace}
                board={board1}
                isTurn={isPlayer1Turn}
                hasRolled={!canRoll}
            />

            <section className="roll-top">
                <img
                    className="roll-die"
                    src={currentDice}
                    alt="die placeholder"
                    style={{opacity: !isPlayer1Turn || canRoll ? 0.4 : 1}}
                />
            </section>

            <section className="roll-bottom">
                <button
                    className="roll-button"
                    onClick={rollDice}
                    disabled={!isGameOver && !canRoll}
                >
                    {isGameOver ? "New Game" : "Roll"}
                </button>
            </section>

            <Player
                player="player2"
                playerName="Guest2"
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
        </section>
    )
}
