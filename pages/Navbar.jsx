import { Link, Outlet } from "react-router-dom"

export default function Navbar() {
    return (
        <>
            <header>
                <Link
                    to=".."
                    className="back-button"
                >
                    <span className="material-symbols-outlined">arrow_back</span>
                </Link>
            </header>
            <div className="main-content">
                <Outlet />
            </div>
        </>
    )
}
