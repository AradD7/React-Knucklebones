import axios from "axios"
import { useEffect, useState } from "react"
import { useLocation, useOutletContext, useSearchParams } from "react-router-dom"

export default function VerifyEmail() {
    const [searchParams] = useSearchParams()
    const token = searchParams.get("token")
    const [verified, setVerified] = useState(false)

    const [response, setResponse] = useState(null)
    const location = useLocation()
    const [status, setStatus] = useState(location.state ? location.state.status : null)

    const {setPlayerInfo} = useOutletContext()

    const [isClicked, setIsClicked] = useState(false)

    useEffect(() => {
        if (token) {
            axios.post("/players/verify", {
                token: token,
            })
                .then(response => {
                    localStorage.setItem("accessToken", response.data.token)
                    localStorage.setItem("refreshToken", response.data.refresh_token)
                    setPlayerInfo({
                        username: response.data.username,
                        avatar: parseInt(response.data.avatar),
                        displayName: response.data.display_name,
                    })

                    setVerified(true)
                    const from = location.state?.from || '/';
                    setTimeout(() => navigate(from, { replace: true }), 1500);
                })
                .catch(error => {
                    setStatus("exipred")
                    console.log(error)
                })
        }
    }, [token])

    function handleReverification(){
        setIsClicked(true)
        axios.post("/players/resendverification", {
            email: location.state.email,
            username: location.state.username
        })
        .then(response => {
                if (response.status == 200) {
                    setResponse("success")
                }
            })
        .catch(error => {
                if (error.status == 429) {
                    setResponse("fail")
                }
                console.log(error)
            })
    }
    return (
        !token ?
            <section className="verification">
                {status &&
                    (status == "created" ?
                        <>
                            <h2 className="success">Acount Created!</h2>
                            <h1>Please check your email to verify your account</h1>
                            <button disabled={isClicked} onClick={handleReverification} className="reverification"> Resend Email </button>
                        </> :
                        status == "signedIn" ?
                            <>
                                <h2 className="fail"> Account Not Verified </h2>
                                <h1>Please check your email to verify your account</h1>
                                <button disabled={isClicked} onClick={handleReverification} className="reverification"> Resend Email </button>
                            </> :
                            <h1 className="fail"> Token is expired. Use the button below to get a new one</h1>
                    )
                }
                {response ?
                    <p className={`verification-response ${response === "success" ? "success" : "fail"}`}>
                        {response === "success" ? "Sent!" : `You have to wait 30 minutes in between requests`}
                    </p> :
                    ""
                }
            </section> :
            <section className="verification with-token">
                {verified ?
                    <h1 className="success">Acount Verified!</h1> :
                    <h1>Verifying Acount...</h1>
                }
            </section>
    )
}
