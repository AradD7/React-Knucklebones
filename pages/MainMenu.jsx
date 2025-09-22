import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import RefreshJwtToken from "./utils";

//**ai play**
//
//**view profile
//  set display name
//  set avatar
//**
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
//Email verification
//sing in with google

export default function MainMenu() {
    const refreshToken = localStorage.getItem("refresh_token")
    const [token, setToken] = useState(null)
    const [playerInfo, setPlayerInfo] = useState({
        username: null,
        avatar: null,
    })
    const [showLocalPlay, setShowLocalPlay] = useState(false)

    useEffect(() => {
        RefreshJwtToken(refreshToken)
        .then(token => setToken(token))
        .catch(error => console.log("Token invalid, login again: ", error.message))
    }, [])

    useEffect(() => {
        if (token !== null) {
            fetch("http://localhost:8080/api/players/getplayer", {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            })
            .then(response => {
                    if (!response.ok) {
                        throw new Error("token invalid")
                    }
                    return response.json()
                })
            .then(data => {{
                    setPlayerInfo({
                        username: data.username,
                        avatar: data.avatar
                    })
                }})
            .catch(error => {
                    console.log("Please refresh token: ", error.message)
                })
    }}, [token])

    function signout() {
        fetch("http://localhost:8080/api/tokens/revoke", {
            headers: {
                "Authorization": `Bearer ${refreshToken}`
            }
        })
        .then(response => {
                if (response.ok) {
                    localStorage.removeItem("refresh_token")
                    localStorage.removeItem("token")
                    setToken(null)
                }
            })
    }
    localStorage.setItem("token", token)
    return (
        <section className="main-menu" onMouseLeave={() => setShowLocalPlay(false)}>
            {token === null ?
            <>
                <h1 className="welcome-text">Welcome!</h1>
                <Link
                    to="signin"
                    onMouseEnter={() => setShowLocalPlay(false)}
                >
                    <h1 className="menu-entry">Sign In</h1>
                </Link>
            </> :
            <h1
                className="welcome-text"
                onMouseEnter={() => setShowLocalPlay(false)}
            >
                Hi, {playerInfo.username ?? ''}!
            </h1>
            }

            <h1 className={`menu-entry localplay-text ${showLocalPlay ? 'showing' : 'hiding'}`}
                onMouseEnter={() => setShowLocalPlay(true)}
            >
                Local Play
            </h1>
                <section
                    className={`submenu ${showLocalPlay ? 'show' : 'hide'}`}
                >
                    <Link to="localplay">
                        <h1
                            onMouseEnter={() => setShowLocalPlay(true)}
                        >
                            VS Player
                        </h1>
                    </Link>
                    <Link to="signin">
                        <h1
                            onMouseEnter={() => setShowLocalPlay(true)}
                        >
                            VS AI
                        </h1>
                    </Link>
                </section>

            <Link
                to={token === null ? "signin" : "onlineplay"}
            >
                <h1
                    className="menu-entry"
                    onMouseEnter={() => setShowLocalPlay(false)}
                >
                    Online Play
                </h1>
            </Link>
            {token !== null &&
                <h1
                    className="menu-entry"
                    onClick={signout}
                    onMouseEnter={() => setShowLocalPlay(false)}
                >Sign Out</h1>}
        </section>

    )
}
