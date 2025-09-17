export default function Player(props) {
    return (
        props.player === "player1" ? (
            <section className={`${props.player}-info`} style={{opacity: props.isTurn ? 1 : 0.5}}>
                <h1>{props.playerName}</h1>
                <img src="/images/lamb.jpg" alt="lamb avatar" />
                <section className={`${props.player}-score`}>{props.score}</section>
            </section>) : (
            <section className={`${props.player}-info`} style={{opacity: props.isTurn ? 1 : 0.5}}>
                <img src="/images/lamb.jpg" alt="lamb avatar" />
                <section className={`${props.player}-score`}>{props.score}</section>
                <h1>{props.playerName}</h1>
            </section>)
    )
}
