import { useState } from "react";
import { Link, useOutletContext } from "react-router-dom";

//**view profile
//  set display name
//  set avatar
//**
//
//**show username (or display name)
//on online games
//**
//
//** keyboard inputs **
//
//**Select difficulty for
//vs computer
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
    const { token, setToken } = useOutletContext()
    const { playerInfo } = useOutletContext()

    function signout() {
        fetch("http://localhost:8080/api/tokens/revoke", {
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("refresh_token")}`
            }
        })
        .then(response => {
                if (response.ok) {
                    localStorage.removeItem("refresh_token")
                    setToken(null)
                }
            })
    }

    const [showLocalPlay, setShowLocalPlay] = useState(false)

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
                Hi, {playerInfo.displayName === "" ? playerInfo.username : playerInfo.displayName}!
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
                    <Link to="vscomputer">
                        <h1
                            onMouseEnter={() => setShowLocalPlay(true)}
                        >
                            VS Computer
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
