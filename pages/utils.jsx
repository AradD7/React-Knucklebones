import Die1 from "/images/die-1.png"
import Die2 from "/images/die-2.png"
import Die3 from "/images/die-3.png"
import Die4 from "/images/die-4.png"
import Die5 from "/images/die-5.png"
import Die6 from "/images/die-6.png"

export const Dice = [null, Die1, Die2, Die3, Die4, Die5, Die6]

export default async function RefreshJwtToken(refreshToken) {
    const response = await fetch("http://localhost:8080/api/tokens/refresh", {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${refreshToken}`
        }
    })

    if (!response.ok) {
        throw new Error("token invalid")
    }

    const data = await response.json()
    return data.token
}

export function RandomInt(max, min = 0) {
    if (min > max) {
        [min, max] = [max, min]
    }
    return Math.floor(Math.random() * (max - min)) + min;
}
