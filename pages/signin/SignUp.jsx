import { Link } from "react-router-dom"

export default function SignUp() {

    function signup(formData) {
        const data = Object.fromEntries(formData)
        fetch("http://localhost:8080/api/players/new", {
            method: "POST",
            body:   JSON.stringify({
                username: data.username,
                password: data.password,
            }),
            headers: {
                "Content-Type": "application/json",
            }
        })
        .then(response => {
                if (response.ok) {
                    console.log("player successfully created")
                    return response.json()
                }
                console.log("failed to create player")
                return response.json()
            })
        .then(data => console.log(data))
    }

    return (
        <section className="signin-section">
            <h1 className="signup-h1">Make an Account!</h1>
            <form action={signup}>
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
                    <button>Sign Up</button>
                </section>
                <section className="redirect-section">
                    <p>Have an account? <Link to="/signin">Sign In!</Link></p>
                </section>
            </form>
        </section>
    )
}
