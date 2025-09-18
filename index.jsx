import { createRoot } from "react-dom/client"
import Game from "./pages/localPlay/Game"
import SignIn from "./pages/signin/SingIn"
import SignUp from "./pages/signin/SignUp"
import { BrowserRouter, Routes, Route } from "react-router-dom"

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/localplay" element={<Game />} />
                <Route path="/signin" element={<SignIn />} />
                <Route path="/signup" element={<SignUp />} />
            </Routes>
        </BrowserRouter>
    )
}

createRoot(document.getElementById("root")).render(
    <App />
)
