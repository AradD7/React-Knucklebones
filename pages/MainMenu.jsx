import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import RefreshJwtToken from "./utils";

//**fix local game confetti animations**
//
//**logout**
//
//**guest user**
//
//**view profile
//  set display name
//  set avatar
//**
//
//**ai play**
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
    const [token, setToken] = useState(() => null)
    const [playerInfo, setPlayerInfo] = useState(() => ({
        username: null,
        avatar: null,
    }))

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

    localStorage.setItem("token", token)
    return (
        <section className="main-menu">
            {token === null ?
            <>
                <h1>Welcome!</h1>
                <Link
                    to="signin"
                >
                    <h1>Sign In</h1>
                </Link>
            </> :
            <h1>Hi {playerInfo.username ?? ''}!</h1>
            }

            <Link
                to="localplay"
            >
                <h1>Local Play</h1>
            </Link>

            <Link
                to="onlineplay"
            >
                <h1>Online Play</h1>
            </Link>

        </section>

    )
}
