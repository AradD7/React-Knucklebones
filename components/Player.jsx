export default function Player(props) {
    return (
        props.player === "player1" ? (
            <section className={`${props.player}-info`}>
                <h1>{props.playerName}</h1>
                <img src="/images/lamb.jpg" alt="lamb avatar" />
                <section className={`${props.player}-score`}>24</section>
            </section>) : (
            <section className={`${props.player}-info`}>
                <img src="/images/lamb.jpg" alt="lamb avatar" />
                <section className={`${props.player}-score`}>120</section>
                <h1>{props.playerName}</h1>
            </section>)
    )
}
