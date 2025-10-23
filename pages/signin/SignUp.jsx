import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom"

export default function SignUp() {
    const [error, setError] = useState("")
    const [showError, setShowError] = useState(false)
    const navigate = useNavigate()

    function signup(formData) {
        const data = Object.fromEntries(formData);

        axios.post("/players/new", {
            username: data.username,
            email:    data.email,
            password: data.password
        })
            .then(() => {
                navigate("/verify", {
                    state: { status: "created", email: data.email}
                })
            })
            .catch(error => {
                if (error.response.status === 400) {
                    const emailErr = "Account with that email already exists"
                    const userErr = "Account with that username already exists"
                    if (error.response.data.error === emailErr) {
                        setShowError(true)
                        setError(emailErr)
                        return
                    }
                    if (error.response.data.error === userErr) {
                        setShowError(true)
                        setError(userErr)
                        return
                    }
                }
                setShowError(true)
                setError("Something went wrong")
                return
            });

        if (data.username.length < 4 || data.username.length > 10) {
            setShowError(true)
            setError("Username must be between 4 and 12 characters")
            return
        }
        if (data.password.length < 7) {
            setShowError(true)
            setError("Password must be between at least 8 characters")
            return
        }
    }

    return (
        <section className="signin-section">
            <h1 className="signup-h1">Make an Account!</h1>
            <div className={showError ? "errors-container show" : "errors-container"}>
                <h2 className="signup-h2">{error}</h2>
            </div>
            <form action={signup}>
                <section className="input-section">
                    <label htmlFor="username">Username:</label>
                    <input
                        id="username"
                        placeholder="BigSteve"
                        type="text"
                        name="username"
                        onFocus={(e) => {
                            e.target.placeholder = ''
                            setShowError(false)
                            setTimeout(() => setError(""), 400)
                        }}
                        onBlur={(e) => e.target.placeholder = 'BigSteve'}
                        required
                    />
                </section>

                <section className="input-section">
                    <label htmlFor="email" className="email-label">Email:</label>
                    <input
                        id="email"
                        placeholder="bigsteve@loco.com"
                        type="email"
                        name="email"
                        onFocus={(e) => {
                            e.target.placeholder = ''
                            setShowError(false)
                            setTimeout(() => setError(""), 400)
                        }}
                        onBlur={(e) => e.target.placeholder = 'bigsteve@loco.com'}
                        required
                    />
                </section>

                <section className="input-section">
                    <label htmlFor="password">Password:</label>
                    <input id="password"
                        placeholder="passw0rd"
                        type="password"
                        name="password"
                        onFocus={(e) => {
                            e.target.placeholder = ''
                            setShowError(false)
                            setTimeout(() => setError(""), 400)
                        }}
                        onBlur={(e) => e.target.placeholder = 'passw0rd'}
                        required
                    />
                </section>

                <section className="button-section">
                    <button>Sign Up</button>
                </section>
                <section className="redirect-section">
                    <p>Have an account? <Link to="/signin">Sign In!</Link></p>
                </section>
            </form>
        </section>
    )
}
