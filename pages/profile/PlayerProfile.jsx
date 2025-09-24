import { useOutletContext } from "react-router-dom"
import { ProfilePics } from "../utils"
import { useState } from "react"

export default function PlayerProfile(){
    const { token, playerInfo, setPlayerInfo } = useOutletContext()

    const [avatarIdx, setAvatarIdx] = useState(playerInfo.avatar === "" ? 8 : parseInt(playerInfo.avatar))
    const [isChangingName, setIsChanginName] = useState(false)
    const [isChangingAvatar, setIsChanginAvatar] = useState(false)

    function updateProfile(formData){
        const data = Object.fromEntries(formData)
        console.log(data)
        fetch("http://localhost:8080/api/players/update", {
            method: "POST",
            body: JSON.stringify({
                display_name: data.displayName,
                avatar: data.avatar
            }),
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        })
        .then(resp => {
                if (resp.ok) {
                    setPlayerInfo(prev => ({...prev,
                        avatar: data.avatar,
                        displayName: data.displayName
                    }))
                    console.log("successfully updated!")
                } else{
                    console.log("failed to update")
                }
            })
    }

    function setAvatar(idx) {
        setAvatarIdx(idx)
        setIsChanginAvatar(false)
    }

    function handleAvatarChange() {
        setIsChanginAvatar(true)
    }

    function handleNameChange() {
        setIsChanginName(true)
    }

    const pictureButtons = ProfilePics.slice(1).map((pic, idx) => (
        <img
            key={idx + 1}
            id={idx + 1}
            src={pic}
            alt={`profile picture number ${idx + 1}`}
            onClick={() => setAvatar(idx + 1)}
            />
    ))
    return (
        <section className="player-profile">
            <h1 className="profile-title">
                {`${playerInfo.username}${playerInfo.username[playerInfo.username.length - 1] === 's' ? "'" : "'s"} Profile`}
            </h1>
            <form action={updateProfile}>
                <input type="hidden" name="avatar" value={avatarIdx} />
                <input type="hidden" name="displayName" value={playerInfo.displayName === "" ? playerInfo.username : playerInfo.displayName} />
                <section className="input-display-name">
                    <label htmlFor="displayName">Display Name</label>
                    {!isChangingName ?
                        <>
                            <p>
                                {playerInfo.displayName === "" ? playerInfo.username : playerInfo.displayName}
                                <span onClick={handleNameChange} className="material-symbols-outlined">
                                    edit_square
                                </span>
                            </p>
                        </>:
                            <input
                                id="displayName"
                                placeholder="BigSteve"
                                type="text"
                                name="displayName"
                                onFocus={(e) => e.target.placeholder = ''}
                                onBlur={(e) => e.target.placeholder = 'BigSteve'}
                        />
                    }
                </section>

                <section className="input-avatar">
                    <label htmlFor="avatar">Avatar</label>
                    {!isChangingAvatar ?
                        <>
                            <input
                                src={ProfilePics[avatarIdx]}
                                alt={`Profile picture number ${avatarIdx + 1}`}
                                type="image"
                                className="avatar-image"
                                name="avatar"
                            />
                            <span onClick={handleAvatarChange} className="material-symbols-outlined">
                                edit_square
                            </span>
                        </> :
                            <div className="profile-pictures">
                                {pictureButtons}
                            </div>
                    }
                </section>

                <section className="update-button">
                    <button>Update</button>
                </section>
            </form>
        </section>
    )
}
