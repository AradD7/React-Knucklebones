import { createRoot } from "react-dom/client"
import Game from "./components/Game"

function App() {
    return (
        <Game />
    )
}

createRoot(document.getElementById("root")).render(
    <App />
)
