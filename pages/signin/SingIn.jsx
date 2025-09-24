import { Link, useNavigate, useOutletContext } from "react-router-dom"
import { useState } from "react"

export default function SignIn() {
    const [status, setStatus] = useState(null)
    const { setToken } = useOutletContext()

    const navigate = useNavigate()

    function signin(formData) {
        const data = Object.fromEntries(formData)

        fetch("http://localhost:8080/api/players/login", {
            method: "POST",
            body:   JSON.stringify({
                username: data.username,
                password: data.password,
            }),
            headers: {
                "Content-Type": "application/json"
            },
        })
        .then(response => response.json())
        .then(data => {
                if (data.error != null) {
                    setStatus("Wrong username or password")
                } else{
                    localStorage.setItem("refresh_token", data.refresh_token)
                    setToken(data.token)
                    setStatus("Signed In!")
                    navigate("/")
                }
            })
    }

    return (
        <section className="signin-section">
            <h1>Enter Information:</h1>
            {status && <h2 style={{color: status === "Signed In!" ? "green" : "red"}}>{status}</h2>}
            <form action={signin}>
                <section className="input-section">
                    <label htmlFor="username">Username:</label>
                    <input
                        id="username"
                        placeholder="BigSteve"
                        type="text"
                        name="username"
                        defaultValue="usertest"
                        onFocus={(e) => e.target.placeholder = ''}
                        onBlur={(e) => e.target.placeholder = 'BigSteve'}
                    />
                </section>

                <section className="input-section">
                    <label htmlFor="password">Password:</label>
                    <input id="password"
                        placeholder="passw0rd"
                        type="password"
                        name="password"
                        defaultValue="usertest"
                        onFocus={(e) => e.target.placeholder = ''}
                        onBlur={(e) => e.target.placeholder = 'passw0rd'}
                    />
                </section>

                <section className="button-section">
                    <button>Sign In</button>
                </section>
                <section className="redirect-section">
                    <p>Don't have an account? <Link to="/signup">Sign Up!</Link></p>
                </section>
            </form>
        </section>
    )
}
