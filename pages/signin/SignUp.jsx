import axios from "axios";
import { Link, useNavigate } from "react-router-dom"

export default function SignUp() {
    const navigate = useNavigate()

    function signup(formData) {
        const data = Object.fromEntries(formData);

        axios.post("/players/new", {
            username: data.username,
            email:    data.email,
            password: data.password
        })
            .then(response => {
                navigate("/verify", {
                    state: { status: "created", email: data.email}
                })
                console.log(response.data);
            })
            .catch(error => {
                console.log("failed to create player");
                console.log(error.response?.data || error.message);
            });
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
                        onFocus={(e) => e.target.placeholder = ''}
                        onBlur={(e) => e.target.placeholder = 'BigSteve'}
                    />
                </section>

                <section className="input-section">
                    <label htmlFor="email" className="email-label">Email:</label>
                    <input
                        id="email"
                        placeholder="bigsteve@loco.com"
                        type="email"
                        name="email"
                        onFocus={(e) => e.target.placeholder = ''}
                        onBlur={(e) => e.target.placeholder = 'bigsteve@loco.com'}
                    />
                </section>

                <section className="input-section">
                    <label htmlFor="password">Password:</label>
                    <input id="password"
                        placeholder="passw0rd"
                        type="password"
                        name="password"
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
