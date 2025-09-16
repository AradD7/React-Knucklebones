export default function Board(props) {
    return (
        <section className={`${props.player}-board`}>
            <button></button>
            <button></button>
            <button className="right-buttons"></button>
            <button></button>
            <button></button>
            <button className="right-buttons"></button>
            <button className="bottom-buttons"></button>
            <button className="bottom-buttons"></button>
            <button className="bottom-buttons right-buttons"></button>
        </section>
    )
}
