import { Link } from "react-router-dom"

export default function SignIn() {

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
        .then(data => console.log(data))
    }

    return (
        <section className="signin-section">
            <h1>Welcome!</h1>
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
