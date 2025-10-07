import Board from "./Board"
import Player from "./Player"
import Instructions from "../Instructions"
import { useState, useEffect, useRef } from "react"
import { Dice, ProfilePics } from "../../utils"
import QRCode from "react-qr-code"
import useWebSocket, { ReadyState } from "react-use-websocket"
import { WhatsappIcon, TelegramIcon, WhatsappShareButton, TelegramShareButton } from "react-share"
import ConfettiExplosion from 'react-confetti-explosion'
import { useNavigate, useOutletContext, useSearchParams } from "react-router-dom"
import axios from "axios"

export default function OnlineGame() {
    const intervalRef = useRef(null)
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
    const [oppInfo, setOppInfo] = useState({
        displayName: "",
        avatar: "8",
    })
    const [showVsInfo, setShowVsInfo] = useState(false)
    const [showPlayerInfo ,setShowPlayerInfo] = useState(false)
    const [showOppInfo ,setShowOppInfo] = useState(false)
    const [showVsText ,setShowVsText] = useState(false)

    const [socketUrl, setSocketUrl] = useState(() => null);
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
                Type: "auth",
                Token: localStorage.getItem("accessToken")
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
            if (msg.type === "refresh" || msg.type === "joined") {
                if (msg.type === "joined"){
                    setOppInfo({
                        displayName: msg.display_name,
                        avatar: msg.avatar
                    })
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
                }
                axios.get(`/games/${gameId}`)
                .then(response => {
                        setBoard1(response.data.board1)
                        setBoard2(response.data.board2)
                        setScore1(response.data.score1)
                        setScore2(response.data.score2)
                        setIsGameOver(response.data.is_over)
                        setCurrentDice(Dice[5])
                        setIsPlayer1Turn(response.data.is_turn)
                        setCanRoll(response.data.is_turn)
                    })
                .catch(error => {
                        console.log(error)
                    })
            } else if (msg.type === "roll") {
                const finalRoll = msg.dice;
                animateDiceRoll(finalRoll)
            }
        }
    }, socketUrl != null);

    useEffect(() => {
        if (gameId === null) {
            axios.get("/games/new")
                .then(response => {
                    const data = response.data;
                    setGameId(data.id);
                    setSocketUrl(`${import.meta.env.VITE_WEBSOCKET_URL}${data.id}`);
                    setSearchParams(prev => ({...Object.fromEntries(prev), gameid: data.id}));
                })
                .catch(error => {
                    console.log("Error creating new game:", error);
                });
        } else {
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
                    if (!data.is_over) {
                        setSocketUrl(`${import.meta.env.VITE_WEBSOCKET_URL}${data.id}`);
                    }
                })
                .catch(error => {
                    console.log("Error loading game:", error);
                });
        }
    }, [newGame]);

    useEffect(() => {
        setShareLink(`https://sillyminigames.com/joingame?gameid=${gameId}`)
    }, [gameId])


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

        setGameId(null);
        setBoard1([[0, 0, 0], [0, 0, 0], [0, 0, 0]]);
        setIsGameOver(false);
        setScore1(0);
        setScore2(0);
        setBoard2(null);
        setNewGame(prev => !prev);
        setSearchParams({});
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
            board1: board1,
            board2: board2,
            turn: isPlayer1Turn ? "player1" : "player2",
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

    const handleClipboard = async () => {
        try {
            await navigator.clipboard.writeText(shareLink);
        } catch (error) {
            console.error('Failed to copy text: ', error);
        }
    };

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
                    playerName={!playerInfo.displayName ? playerInfo.username : playerInfo.displayName}
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
                            playerName={oppInfo.displayName}
                            pic={oppInfo.avatar}
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
        </>
    )
}
/*
*/
