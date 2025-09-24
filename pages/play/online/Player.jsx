import { ProfilePics } from "../../utils";

export default function Player(props) {
    console.log(props.pic)
    return (
        props.player === "player1" ? (
            <section className={`${props.player}-info`}>
                <h1>{props.playerName}</h1>
                <img src={ProfilePics[parseInt(props.pic)]} alt="lamb avatar" className="profile-picture"/>
                <section className={`${props.player}-score`}>{props.score}</section>
            </section>) : (
            <section className={`${props.player}-info`}>
                <img src={ProfilePics[parseInt(props.pic)]} alt="lamb avatar" className="profile-picture"/>
                <section className={`${props.player}-score`}>{props.score}</section>
                <h1>{props.playerName}</h1>
            </section>)
    )
}
