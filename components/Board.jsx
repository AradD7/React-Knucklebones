import { Dice } from "./utils"

export default function Board(props) {
    const isDisabled = new Array(9).fill(true)
    const colBlocked = new Array(3).fill(false)
    let buttons = []

    if (props.player === "player1") {
        if (props.isTurn && props.hasRolled) {
            for (let row = 2; row >=0; row--) {
                for (let col = 0; col < 3; col++) {
                    if (props.board[row][col] == 0 && !colBlocked[col]) {
                        isDisabled[(row * 3) + col] = false
                        colBlocked[col] = true
                    }
                }
            }
        }
        buttons = props.board.map((row, indexR) =>
            row.map((col, indexC) => {
                const key = indexC + (indexR * 3)
                return (
                    <button
                        key={key}
                        onClick={() => props.place(indexR, indexC)}
                        disabled={isDisabled[key]}
                    >
                        <img src={Dice[col]} alt={Dice[col] === null ? null : `die of value ${col}`} />
                    </button>)
            }
            ))
    }
    if (props.player === "player2") {
        if (props.isTurn && props.hasRolled) {
            let counter = 0
            for (let row = 2; row >= 0; row--) {
                for (let col = 0; col < 3; col++) {
                    if (props.board[row][col] == 0 && !colBlocked[col]) {
                        isDisabled[counter] = false
                        colBlocked[col] = true
                    }
                    counter++
                }
            }
        }
        buttons = props.board.toReversed().map((row, indexR) =>
            row.map((col, indexC) => {
                const key = indexC + (indexR * 3)
                return (
                    <button
                        key={key}
                        onClick={() => props.place(2-indexR, indexC)}
                        disabled={isDisabled[key]}
                    >
                        <img src={Dice[col]} alt={Dice[col] === null ? null : `die of value ${col}`} />
                    </button>)
            }
            ))
    }


    return (
        <section className={`${props.player}-board`} style={{opacity: props.isTurn ? 1 : 0.7}}>
            {buttons}
        </section>
    )
}
/*
            <button></button>
            <button></button>
            <button className="right-buttons"></button>
            <button></button>
            <button></button>
            <button className="right-buttons"></button>
            <button className="bottom-buttons"></button>
            <button className="bottom-buttons"></button>
            <button className="bottom-buttons right-buttons"></button>
*/
