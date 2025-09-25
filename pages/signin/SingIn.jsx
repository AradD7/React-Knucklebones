import { Link, useLocation, useNavigate, useOutletContext } from "react-router-dom"
import { useState } from "react"
import axios from "axios"

export default function SignIn() {
    const [status, setStatus] = useState(null)
    const {setPlayerInfo} = useOutletContext()


    const navigate = useNavigate()
    const location = useLocation();

    function signin(formData) {
        const data = Object.fromEntries(formData)

        axios.post("/players/login", {
            username: data.username,
            password: data.password
        })
            .then(response => {
                const data = response.data;
                if (data.error != null) {
                    setStatus("Wrong username or password");
                } else {
                    localStorage.setItem("refreshToken", data.refresh_token);
                    localStorage.setItem("accessToken", data.token); // ← Store access token too
                    console.log(data)
                    setPlayerInfo({
                        username: data.username,
                        avatar: data.avatar,
                        displayName: data.display_name,
                    })
                    setStatus("Signed In!");
                    const from = location.state?.from || '/';
                    navigate(from, { replace: true });
                }
            })
            .catch(error => {
                console.log("Login failed:", error);
                setStatus("Login failed. Please try again.");
            });
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
