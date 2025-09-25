import { createRoot } from "react-dom/client"
import MainMenu from "./pages/MainMenu"
import LocalGame from "./pages/play/local/LocalGame"
import OnlineGame from "./pages/play/online/OnlineGame"
import JoinGame from "./pages/play/online/JoinGame"
import SignIn from "./pages/signin/SingIn"
import SignUp from "./pages/signin/SignUp"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Navbar from "./pages/Navbar"
import ComputerGame from "./pages/play/computer/ComputerGame"
import PlayerProfile from "./pages/profile/PlayerProfile"
import "./src/api/config"


function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Navbar />}>
                    <Route index element={<MainMenu />} />

                    <Route path="localplay" element={<LocalGame />} />
                    <Route path="vscomputer" element={<ComputerGame />} />
                    <Route path="onlineplay" element={<OnlineGame />} />
                    <Route path="joingame" element={<JoinGame />} />

                    <Route path="profile" element={<PlayerProfile />} />

                    <Route path="signin" element={<SignIn />} />
                    <Route path="signup" element={<SignUp />} />
                </Route>
            </Routes>
        </BrowserRouter>
    )
}

createRoot(document.getElementById("root")).render(
    <App />
)
