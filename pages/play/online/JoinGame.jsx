import Board from "./Board"
import Player from "./Player"
import Instructions from "./Instructions"
import { useState, useEffect } from "react"
import { Dice } from "../../utils"
import Confetti from 'react-confetti'
import { useWindowSize } from 'react-use'
//import QRCode from "react-qr-code"
import useWebSocket, { ReadyState } from "react-use-websocket"
import { useSearchParams } from "react-router-dom"

export default function OnlineGame() {
    const [searchParams] = useSearchParams()
    const gameId = searchParams.get("gameid")
    console.log(gameId)

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
            console.log('WebSocket connected!');
            sendJsonMessage({
                type: "auth",
                token: token
            })
        },
        onMessage: (event) => {
            console.log('WebSocket message received:', event.data);
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
                        console.log(data)
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
                        console.log('Request to get new dice was successful!')
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
        setIsGameOver(false)
    }

    function handlePlace(row, col) {
        console.log(`${col}, ${row} was presses`)
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
                    console.log('successfully placed dice!')
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

    console.log("websocket connection status is: ", connectionStatus)
    const { width = 600 } = useWindowSize()
    const height = 330
    function endgame() {
        if (score1 > score2) {
            return (
                <>
                    <Confetti
                        width={width}
                        height={height}
                        style={{marginLeft: 60, marginRight: 60}}
                    />
                    <h1 className="announce-winner">Guest1 Won!</h1>
                </>
            )
        }
        if (score2 > score1) {
            return (
                <>
                    <Confetti
                        width={width}
                        height={height}
                        style={{marginTop: height+30, marginLeft: 60, marginRight: 60}}
                    />
                    <h1 className="announce-winner">Guest2 Won!</h1>
                </>
            )
        }
        return null
    }

    console.log(board2)
    return (
        <section className="local-play">
            {isGameOver && endgame()}
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
                    disabled={!canRoll}
                >
                    {isGameOver ? "Restart" : "Roll"}
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
