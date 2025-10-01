import { ProfilePics } from "../../utils"
import guestPic from "/images/guest.png"
import friendPic from "/images/friend.jpg"

export default function Player(props) {
    return (
        props.player === "player1" ? (
            <section className={`${props.player}-info`} style={{opacity: props.isTurn ? 1 : 0.5}}>
                <h1>{props.playerName}</h1>
                <img src={props.pic ? ProfilePics[props.pic] : guestPic} alt="lamb avatar" className="profile-picture"/>
                <section className={`${props.player}-score`}>{props.score}</section>
            </section>) : (
            <section className={`${props.player}-info`} style={{opacity: props.isTurn ? 1 : 0.5}}>
                <img src={friendPic} alt="lamb avatar" className="profile-picture"/>
                <section className={`${props.player}-score`}>{props.score}</section>
                <h1>{props.playerName}</h1>
            </section>)
    )
}
