import axios from "axios";
import { useState } from "react";
import { Link, useOutletContext } from "react-router-dom";

//** sing in with google
//full front and backend
//implementation **
//
//Email verification
//
//see your games
//
//change cursor to dice
//higlight higher score
//animations
//sound
//
//*****DEPLOYMENT*****
//

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
        setLocalPlayClick(prev => !prev)
    }

    const [difficultyClicked, setDifficultyClicked] = useState(false)
    function showDifficulties() {
        setDifficultyClicked(prev => !prev)
    }

    console.log("main menu: ", playerInfo)
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
                Hi, {playerInfo.displayName === "" ? playerInfo.username : playerInfo.displayName}!
            </h1>
            }
            <h1
                className={`menu-entry localplay-text ${localPlayClicked ? 'showing' : 'hiding'}`}
                onClick={showLocalPlay}
            >
                Local Play
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
                <h1 className="menu-entry">Online Play</h1>
            </Link>
            {token !== null &&
                <h1 className="menu-entry" onClick={signout}>Sign Out</h1>}
        </section>
    )
}
