import { useNavigate } from "react-router-dom"
import { useState } from "react"
import appleLogo from "../../images/apple-icon.png"
import discordLogo from "../../images/discord-icon.png"
import { GoogleLogin } from "@react-oauth/google"
import axios from "axios"

export default function SignIn() {
    const [status, setStatus] = useState(null)
    const navigate = useNavigate()

    return (
        <section className="signin-section">
            <h1>Sign In Options:</h1>
            {status && <h2 style={{color: status === "Signed In!" ? "green" : "red"}}>{status}</h2>}
            <section className="icon-section">
                <img src={appleLogo} alt="Sign in with apple" className="apple-icon"/>
                <GoogleLogin
                    onSuccess={credentialResponse => {
                        axios.post("/auth/goole", {
                            id_token: credentialResponse.credential
                        })
                            .then(response => {
                                localStorage.setItem("accessToken", response.data.token)
                                localStorage.setItem("refreshToken", response.data.refresh_token)
                                setStatus("Signed In!")
                            })
                            .catch(error => {
                                setStatus("Something went wrong")
                                console.log(error)
                            })
                    }}
                    onError={() => {
                        setStatus("Sign In Failed")
                    }}
                    theme="filled_black"
                    size="large"
                    text="signin"
                    shape="pill"
                />
                <img src={discordLogo} alt="Sign in with discord" className="discord-icon"/>
            </section>
            <h2 className="or-h2"> or: </h2>
            <button disabled className="goto-email" onClick={() => navigate("/signinwithemail")}>Continue with Email</button>
        </section>
    )
}
