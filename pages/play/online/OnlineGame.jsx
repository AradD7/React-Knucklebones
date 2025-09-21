import Board from "./Board"
import Player from "./Player"
import Instructions from "./Instructions"
import { useState, useEffect } from "react"
import RefreshJwtToken, { Dice } from "../../utils"
import QRCode from "react-qr-code"
import useWebSocket, { ReadyState } from "react-use-websocket"
import { WhatsappIcon, TelegramIcon, WhatsappShareButton, TelegramShareButton } from "react-share"
import ConfettiExplosion from 'react-confetti-explosion'
import { useNavigate, useSearchParams } from "react-router-dom"

export default function OnlineGame() {
    const navigate = useNavigate()
    const [searchParams, setSearchParams] = useSearchParams()

    const [currentDice, setCurrentDice] = useState(() => Dice[5])
    const [canRoll, setCanRoll] = useState(() => false)
    const [gameId, setGameId] = useState(() => searchParams.get("gameid"))
    const [board1, setBoard1] = useState(() => [[0, 0, 0], [0, 0, 0] ,[0, 0, 0]])
    const [board2, setBoard2] = useState(() => null)
    const [score1, setScore1] = useState(() => 0)
    const [score2, setScore2] = useState(() => null)
    const [isPlayer1Turn, setIsPlayer1Turn] = useState(() => false)
    const [isGameOver, setIsGameOver] = useState(() => false)
    const [shareLink, setShareLink] = useState(() => "")
    const [newGame, setNewGame] = useState(() => false)

    const [socketUrl, setSocketUrl] = useState(() => null);
    const token = localStorage.getItem("token")


    const { sendJsonMessage, readyState } = useWebSocket(socketUrl, {
        onOpen: () => {
            sendJsonMessage({
                Type: "auth",
                Token: token
            })
        },
        onMessage: (event) => {
            const msg = JSON.parse(event.data)
            if (msg.type === "refresh") {
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
    }, socketUrl != null);

    useEffect(() => {
        if (gameId === null) {
            fetch("http://localhost:8080/api/games/new", {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            })
                .then(resp => {
                    if (resp.status === 401) {
                        return RefreshJwtToken(token)
                            .then(data => {
                            localStorage.setItem("token", data)
                            return fetch("http://localhost:8080/api/games/new", {
                                method: "GET",
                                headers: {
                                    "Authorization": `Bearer ${data}`
                                }
                            })
                        })
                    }
                    return resp
                })
                .then(response => response.json())
                .then(data => {
                    setGameId(data.id)
                    setSocketUrl(`ws://localhost:8080/ws/games/${data.id}`)
                    setSearchParams(prev => ({...Object.fromEntries(prev), gameid: data.id}))
                })
        } else {
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
                    if (!data.is_over) {
                        setSocketUrl(`ws://localhost:8080/ws/games/${data.id}`)
                    }
                })
        }
    }, [newGame])

    useEffect(() => {
        setShareLink(`http://localhost:5173/joingame?gameid=${gameId}`)
    }, [gameId])

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
        setGameId(null)
        setBoard1([[0, 0, 0], [0, 0, 0], [0, 0, 0]])
        setIsGameOver(false)
        setScore1(0)
        setScore2(0)
        setBoard2(null)
        setNewGame(prev => !prev)
        setSearchParams({})
        navigate("/onlineplay")
    }

    function handlePlace(row, col) {
        fetch(`http://localhost:8080/api/games/move/${gameId}`, {
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

    const handleClipboard = async () => {
        try {
            await navigator.clipboard.writeText(shareLink);
        } catch (error) {
            console.error('Failed to copy text: ', error);
        }
    };

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
            {board2 === null ?
                <section className="board2-placeholder">
                    <h1>Share the link below to start the game!</h1>
                    <section className="invite-link">
                        <input readOnly defaultValue={shareLink} />
                        <TelegramShareButton url={shareLink} title="Join my game!">
                            <TelegramIcon size={50}/>
                        </TelegramShareButton>
                        <WhatsappShareButton url={shareLink} title="Join my game!">
                            <WhatsappIcon size={50} />
                        </WhatsappShareButton>
                        <span className="material-symbols-outlined" onClick={handleClipboard}>
                            content_copy
                        </span>
                    </section>
                    <section className="qr-code">
                        <QRCode
                            value={shareLink}
                        />
                    </section>
                </section> :
                (<>
                    <Player
                    player="player2"
                    playerName="Guest2"
                    score={score2}
                />
                <Board
                    player="player2"
                    place={handlePlace}
                    board={board2}
                />
                </>)
            }

            <Instructions />
        </section>
    )
}
/*
*/
