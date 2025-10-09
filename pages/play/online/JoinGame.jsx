import Board from "./Board"
import Player from "./Player"
import Instructions from "../Instructions"
import { useState, useEffect, useRef } from "react"
import { Dice, ProfilePics } from "../../utils"
import useWebSocket, { ReadyState } from "react-use-websocket"
import { useLocation, useNavigate, useOutletContext, useSearchParams } from "react-router-dom"
import ConfettiExplosion from 'react-confetti-explosion'
import axios from "axios"

export default function OnlineGame() {
    const [searchParams] = useSearchParams()
    const navigate = useNavigate()
    const location = useLocation()
    const gameId = searchParams.get("gameid")
    const intervalRef = useRef(null)

    const [currentDice, setCurrentDice] = useState(Dice[5])
    const [canRoll, setCanRoll] = useState(false)
    const [board1, setBoard1] = useState([[0, 0, 0], [0, 0, 0] ,[0, 0, 0]])
    const [board2, setBoard2] = useState([[0, 0, 0], [0, 0, 0] ,[0, 0, 0]])
    const [score1, setScore1] = useState(0)
    const [score2, setScore2] = useState(0)
    const [isPlayer1Turn, setIsPlayer1Turn] = useState(false)
    const [isGameOver, setIsGameOver] = useState(false)
    const [oppInfo, setOppInfo] = useState({
        displayName: "",
        avatar: "8",
    })
    const [showVsInfo, setShowVsInfo] = useState(false)
    const [showPlayerInfo ,setShowPlayerInfo] = useState(false)
    const [showOppInfo ,setShowOppInfo] = useState(false)
    const [showVsText ,setShowVsText] = useState(false)

    const socketUrl = `${import.meta.env.VITE_WEBSOCKET_URL}${gameId}`

    const { playerInfo } = useOutletContext()

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

    const { sendJsonMessage, readyState } = useWebSocket(socketUrl, {
        onOpen: () => {
            sendJsonMessage({
                type: "auth",
                token: localStorage.getItem('accessToken')
            })
        },
        shouldReconnect: (closeEvent) => {
            return closeEvent.code != 1000
        },
        reconnectAttempts: 10,
        reconnectInterval: (attemptNumber) => {
            Math.min(Math.pow(2, attemptNumber) * 1000, 20000)
        },
        onMessage: (event) => {
            const msg = JSON.parse(event.data)
            if (msg.type === "refresh") {
                axios.get(`/games/${gameId}`)
                    .then(response => {
                        const data = response.data;
                        setBoard1(data.board1);
                        setBoard2(data.board2);
                        setScore1(data.score1);
                        setScore2(data.score2);
                        setIsGameOver(data.is_over);
                        setCurrentDice(Dice[5]);
                        setIsPlayer1Turn(data.is_turn);
                        setCanRoll(data.is_turn);
                    })
                    .catch(error => {
                        console.log('Error refreshing game state:', error);
                    });
            } else if (msg.type === "roll") {
                const finalRoll = msg.dice;
                animateDiceRoll(finalRoll)
            }
        }
    }, localStorage.getItem('accessToken') !== null);

    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            axios.get(`/games/${gameId}/join`)
                .then(response => {
                    const data = response.data;
                    setScore1(data.score1);
                    setScore2(data.score2);
                    setIsGameOver(data.is_over);
                    setCurrentDice(Dice[5]);
                    setIsPlayer1Turn(data.is_turn);
                    setCanRoll(data.is_turn);
                    setOppInfo({
                        displayName: data.opp_name,
                        avatar: data.opp_avatar,
                    });
                    setTimeout(() => setShowVsInfo(true), 500)
                    setTimeout(() => setShowPlayerInfo(true), 1100)
                    setTimeout(() => setShowVsText(true), 2100)
                    setTimeout(() => setShowOppInfo(true), 3200)
                    setTimeout(() => {
                        setShowVsInfo(false)
                        setShowOppInfo(false)
                        setShowPlayerInfo(false)
                        setShowVsText(false)
                    }, 6000)
                })
                .catch(error => {
                    if (error.status === 409) {
                        navigate(`/onlineplay?gameid=${gameId}`)
                    } else {
                        console.log('Error joining game:', error);
                    }
                });
        } else {
            navigate("/signin", { state: { from: location } })
        }
    }, [gameId]);

    function rollDice() {
        if (!isGameOver) {
            if (!canRoll) return; // Prevent double-clicks
            setCanRoll(false);

            axios.get(`/games/roll?game_id=${gameId}`)
                .then(response => {
                    const finalRoll = response.data.dice;
                    animateDiceRoll(finalRoll)
                })
                .catch(err => console.log(err))
            return;
        }

        navigate("/onlineplay");
    }

    useEffect(() => {
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, []);

    function handlePlace(row, col) {
        axios.post(`/games/move/${gameId}`, {
            dice: Dice.indexOf(currentDice),
            row: row,
            col: col
        })
        .then(response => {
            const data = response.data;
            setBoard1(data.board1);
            setBoard2(data.board2);
            setScore1(data.score1);
            setScore2(data.score2);
            setIsGameOver(data.is_over);
            setCurrentDice(Dice[5]);
        })
        .catch(error => {
            console.log('Move failed:', error);
        });
    }

    const connectionStatus = {
        [ReadyState.CONNECTING]: 'Connecting',
        [ReadyState.OPEN]: 'Open',
        [ReadyState.CLOSING]: 'Closing',
        [ReadyState.CLOSED]: 'Closed',
        [ReadyState.UNINSTANTIATED]: 'Uninstantiated',
    }[readyState];

    return (
        <>
            <div className="vs-info" style={{visibility: showVsInfo ? "visible" : "hidden"}}>
                <section className="start-player-info" style={{opacity: showPlayerInfo ? 1 : 0}}>
                    <img src={ProfilePics[parseInt(playerInfo.avatar)]} alt="player avatar" />
                    <h1> {playerInfo.displayName} </h1>
                </section>
                <h1 className="big-vs" style={{opacity: showVsText ? 1 : 0}}> VS </h1>
                <section className="start-opp-info" style={{opacity: showOppInfo ? 1 : 0}}>
                    <h1> {oppInfo.displayName} </h1>
                    <img src={ProfilePics[parseInt(oppInfo.avatar)]} alt="player avatar" />
                </section>
            </div>
            <section className="local-play" style={{opacity: showVsInfo ? 0.2 : 1}}>
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
                    playerName={playerInfo.displayName === null || playerInfo.displayName === "" ? playerInfo.username : playerInfo.displayName}
                    pic={playerInfo.avatar}
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
                    playerName={oppInfo.displayName}
                    pic={oppInfo.avatar}
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
        </>
    )
}
