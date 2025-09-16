import Board from "./Board"
import Player from "./Player"
import Instructions from "./Instructions"

export default function Game() {
    return (
        <>
            <Player player="player1" playerName="Guest1" />
            <Board
                player="player1"
            />

            <section className="roll-die-box">
                <img className="roll-die" src="/images/die-5.png" alt="die placeholder" />
            </section>

            <section className="roll-button-box">
                <button className="roll-button">Roll</button>
            </section>

            <Player player="player2" playerName="Guest2" />
            <Board
                player="player2"
            />

            <Instructions />
        </>
    )
}
