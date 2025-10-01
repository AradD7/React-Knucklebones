import { Link, Outlet } from "react-router-dom"
import { ProfilePics } from "./utils"
import { useEffect, useState } from "react"
import axios from "axios"

export default function Navbar() {
    const [playerInfo, setPlayerInfo] = useState({
        username:    "guest",
        avatar:      "",
        displayName: null,
    })

    useEffect(() => {
        const token = localStorage.getItem("accessToken")
        if (token !== null) {
            axios.get("/players/getplayer")
                .then(response => {
                    console.log("got fresh player info", response.data)
                    setPlayerInfo({
                        username: response.data.username,
                        avatar: response.data.avatar,
                        displayName: response.data.display_name
                    })
                })
                .catch(error => {
                    console.log("Error: ", error.message)
                })
        }}, [])

    return (
        <>
            <header>
                <Link
                    to=".."
                    className="back-button"
                >
                    <span className="material-symbols-outlined">arrow_back</span>
                </Link>

                {playerInfo.avatar === "" ?
                    playerInfo.displayName === null ?
                        <Link to="signin" className="signin-redirect">
                            <h1>Sign In!</h1>
                        </Link> :
                        <Link to="profile" className="nav-profile">
                            <span className="material-symbols-outlined">
                                account_box
                            </span>
                        </Link> :
                    <Link to="profile" className="nav-profile">
                        <img src={ProfilePics[parseInt(playerInfo.avatar)]} />
                    </Link>
                }
            </header>

            <div className="main-content">
                <Outlet context={{playerInfo, setPlayerInfo}}/>
            </div>
        </>
    )
}
