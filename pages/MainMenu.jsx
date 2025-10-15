import axios from "axios";
import { useState } from "react";
import { Link, useOutletContext } from "react-router-dom";

//** input sanitation on frontend **
//
//** add connection status for
//online games to see if other
//person is connected **
//
//** user to set their username **
//
//** sounds **
//
//** higlight higher score**
//
//** add a how to play section **
//
//** move the whole app to its own
//section so that the homepage is for
//silly mini games instead of just
//knucklebones **
//
//sign in with discord
//sign in with apple

export default function MainMenu() {
    const token = localStorage.getItem("accessToken")
    const { playerInfo } = useOutletContext()
    function signout() {
        axios.get("/tokens/revoke")
        .then(() => {
                localStorage.removeItem("refreshToken")
                localStorage.removeItem("accessToken")
                window.location.reload(); // ← Force page refresh
            })
        .catch(error => {
                console.log("failed to logout, ", error)
            })
    }

    const [localPlayClicked, setLocalPlayClick] = useState(false)
    function showLocalPlay() {
        if (difficultyClicked) {
            setDifficultyClicked(false)
        }
        setLocalPlayClick(prev => !prev)
    }

    const [difficultyClicked, setDifficultyClicked] = useState(false)
    function showDifficulties() {
        setDifficultyClicked(prev => !prev)
    }

    return (
        <section className="main-menu">
            {playerInfo.username === "guest" ?
            <>
                <h1 className="welcome-text">Welcome!</h1>
                <Link to="signin">
                    <h1 className="menu-entry">Sign In</h1>
                </Link>
            </> :
            <h1 className="welcome-text">
                Hi, {playerInfo.displayName ? playerInfo.displayName : playerInfo.username}!
            </h1>
            }
            <h1
                className={`menu-entry localplay-text ${localPlayClicked ? 'showing' : 'hiding'}`}
                onClick={showLocalPlay}
            >
                Local Game
            </h1>

            <section className={`submenu ${localPlayClicked ? 'open' : ''}`}>
                <div className="submenu-content">
                    <Link to="localplay">
                        <h1>VS Player</h1>
                    </Link>
                    <Link
                        className={`${difficultyClicked ? 'is-open' : ''}`}
                        onClick={showDifficulties}
                    >
                        <h1>VS Computer</h1>
                    </Link>
                </div>

            </section>
            <section className={`diff-submenu ${difficultyClicked ? 'open' : ''}`}>
                <Link to="vscomputer?difficulty=easy">
                    <h1>Easy</h1>
                </Link>
                <Link to="vscomputer?difficulty=medium">
                    <h1>Medium</h1>
                </Link>
                <Link to="vscomputer?difficulty=hard">
                    <h1>Hard</h1>
                </Link>
            </section>

            <Link to={token === null ? "signin" : "onlineplay"}>
                <h1 className="menu-entry">Online Game</h1>
            </Link>
            <Link to="howtoplay">
                <h1 className="menu-entry how-to-play">How To Play</h1>
            </Link>
            {token !== null &&
                <Link to="gamehistory">
                    <h1 className="menu-entry game-history-entry">Game History</h1>
                </Link>
                }
            <Link to="aboutproject">
                <h1 className="menu-entry about-project">About Project</h1>
            </Link>
            {token !== null &&
                <h1 className="menu-entry signout-entry" onClick={signout}>Sign Out</h1>
            }
        </section>
    )
}
