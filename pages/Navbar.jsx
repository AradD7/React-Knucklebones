import { Link, Outlet } from "react-router-dom"
import RefreshJwtToken, { ProfilePics } from "./utils"
import { useEffect, useState } from "react"

export default function Navbar() {
    const refreshToken = localStorage.getItem("refresh_token")
    const [token, setToken] = useState(null)
    const [playerInfo, setPlayerInfo] = useState({
        username:    "guest",
        avatar:      "",
        displayName: null,
    })

    useEffect(() => {
        console.log("getting fresh jwt")
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
                    console.log("got fresh player info", data)
                    setPlayerInfo({
                        username: data.username,
                        avatar: data.avatar,
                        displayName: data.display_name
                    })
                }})
            .catch(error => {
                    console.log("Please refresh token: ", error.message)
                })
    }}, [token])

    return (
        <>
            <header>
                <Link
                    to=".."
                    className="back-button"
                >
                    <span className="material-symbols-outlined">arrow_back</span>
                </Link>

                <Link
                    to="profile"
                    className="nav-profile"
                >
                    {playerInfo.avatar === "" ?
                    <span class="material-symbols-outlined">
                        account_box
                    </span>:
                        <img src={ProfilePics[playerInfo.avatar]} />
                    }
                </Link>
            </header>

            <div className="main-content">
                <Outlet context={{token, setToken, playerInfo, setPlayerInfo}}/>
            </div>
        </>
    )
}
