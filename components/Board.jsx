import { Dice } from "./utils"

export default function Board(props) {
    const isDisabled = new Array(9).fill(true)
    const colBlocked = new Array(3).fill(false)
    const isHighlighted = [[false, false, false], [false, false, false], [false, false, false]]
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
        for (let col = 0; col < 3; col++) {
            if (props.board[2][col] === props.board[1][col] === props.board[0][col]) {
                isHighlighted[2][col] = true
                isHighlighted[1][col] = true
                isHighlighted[0][col] = true
            } else if (props.board[2][col] === props.board[1][col]) {
                isHighlighted[2][col] = true
                isHighlighted[1][col] = true
            } else if (props.board[2][col] === props.board[0][col]) {
                isHighlighted[2][col] = true
                isHighlighted[0][col] = true
            } else if (props.board[1][col] === props.board[0][col]) {
                isHighlighted[1][col] = true
                isHighlighted[0][col] = true
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
                        <img
                            src={Dice[col]}
                            alt={Dice[col] === null ? null : `die of value ${col}`}
                            style={{backgroundColor: isHighlighted[indexR][indexC] ? "yellow" : null, borderRadius: 10}}
                        />
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
        for (let col = 0; col < 3; col++) {
            if (props.board[0][col] === props.board[1][col] === props.board[2][col]) {
                isHighlighted[0][col] = true
                isHighlighted[1][col] = true
                isHighlighted[2][col] = true
            } else if (props.board[0][col] === props.board[1][col]) {
                isHighlighted[0][col] = true
                isHighlighted[1][col] = true
            } else if (props.board[0][col] === props.board[2][col]) {
                isHighlighted[0][col] = true
                isHighlighted[2][col] = true
            } else if (props.board[1][col] === props.board[2][col]) {
                isHighlighted[1][col] = true
                isHighlighted[2][col] = true
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
                        <img
                            src={Dice[col]}
                            alt={Dice[col] === null ? null : `die of value ${col}`}
                            style={{backgroundColor: isHighlighted[2-indexR][indexC] ? "yellow" : null, borderRadius: 10}}
                        />
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
//style={{backgroundColor: "yellow", borderRadius: 15}}
