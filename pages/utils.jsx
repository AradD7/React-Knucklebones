import Die1 from "/images/die-1.jpg"
import Die2 from "/images/die-2.jpg"
import Die3 from "/images/die-3.jpg"
import Die4 from "/images/die-4.jpg"
import Die5 from "/images/die-5.jpg"
import Die6 from "/images/die-6.jpg"
import P0 from "/images/p0.jpg"
import P1 from "/images/p1.png"
import P2 from "/images/p2.svg"
import P3 from "/images/p3.jpg"
import P4 from "/images/p4.png"
import P5 from "/images/p5.png"
import P6 from "/images/p6.jpeg"
import P7 from "/images/p7.jpeg"
import P8 from "/images/p8.jpg"

export const Dice = [null, Die1, Die2, Die3, Die4, Die5, Die6]
export const ProfilePics = [P0, P1, P2, P3, P4, P5, P6, P7, P8]

export function RandomInt(max, min = 0) {
    if (min > max) {
        [min, max] = [max, min]
    }
    return Math.floor(Math.random() * (max - min)) + min;
}
