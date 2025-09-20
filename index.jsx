import { createRoot } from "react-dom/client"
import MainMenu from "./pages/MainMenu"
import LocalGame from "./pages/play/LocalGame"
import OnlineGame from "./pages/play/OnlineGame"
import JoinGame from "./pages/play/JoinGame"
import SignIn from "./pages/signin/SingIn"
import SignUp from "./pages/signin/SignUp"
import { BrowserRouter, Routes, Route } from "react-router-dom"


function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<MainMenu />} />

                <Route path="/localplay" element={<LocalGame />} />
                <Route path="/onlineplay" element={<OnlineGame />} />
                <Route path="/joingame" element={<JoinGame />} />

                <Route path="/signin" element={<SignIn />} />
                <Route path="/signup" element={<SignUp />} />
            </Routes>
        </BrowserRouter>
    )
}

createRoot(document.getElementById("root")).render(
    <App />
)
