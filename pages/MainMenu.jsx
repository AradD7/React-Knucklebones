import { Link } from "react-router-dom";

export default function MainMenu() {
    const refresh_token = localStorage.getItem("refresh_token")
    const token = localStorage.getItem("token")

    console.log(refresh_token)
    console.log(token)

    return (
        <section className="main-menu">
            <Link
                to="signin"
            >
                <h1>Sign In</h1>
            </Link>

            <Link
                to="localplay"
            >
                <h1>Local Play</h1>
            </Link>

            <Link
                to="onlineplay"
            >
                <h1>Online Play</h1>
            </Link>

        </section>

    )
}
