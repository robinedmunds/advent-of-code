// https://adventofcode.com/2023/day/7

import readInputFile from "../readFile"

const CARD_VALUES = {
    "2": 2,
    "3": 3,
    "4": 4,
    "5": 5,
    "6": 6,
    "7": 7,
    "8": 8,
    "9": 9,
    T: 10,
    J: 11,
    Q: 12,
    K: 13,
    A: 14,
}

type Card = keyof typeof CARD_VALUES
type Cards = [Card, Card, Card, Card, Card]
type Hand = { cards: Cards; bid: number }
type HandStrengths = Hand & { strength: number }

function parseInput(path: string): Hand[] {
    const file = readInputFile(path)
    if (!file) return []

    return file.split("\r\n").map((line) => {
        const [left, right] = line.split(" ")

        return {
            cards: left.split(""),
            bid: +right,
        } as Hand
    })
}

function calcSingleCardStrength(cards: Cards): number {
    let strength = 0

    for (let i = cards.length; i > 0; i -= 1) {
        const value = CARD_VALUES[cards[cards.length - i]]
        strength += value * i
    }

    return strength
}

function calcHandStrength(cards: Cards) {
    const instanceCount: Map<Card, number> = new Map()

    for (const card of cards) {
        const currCount = instanceCount.get(card) ?? 0
        instanceCount.set(card, currCount + 1)
    }

    const instanceCountDesc = [...instanceCount.entries()].sort(
        (a, b) => b[1] - a[1]
    )

    const firstCountCard: Card = instanceCountDesc[0][0]
    const firstCount: number = instanceCountDesc[0][1]

    const strength = calcSingleCardStrength(cards)

    if (firstCount === 5) {
        // five-of-a-kind
        const multi = 8

        return strength + 14 ** multi + CARD_VALUES[firstCountCard] * multi
    }

    const secondCountCard: Card = instanceCountDesc[1][0]
    const secondCount: number = instanceCountDesc[1][1]

    if (firstCount === 4) {
        // four-of-a-kind
        const multi = 7

        return strength + 14 ** multi + CARD_VALUES[firstCountCard] * multi
    }

    if (firstCount === 3 && secondCount === 2) {
        // full house
        const multi = 6

        return (
            strength +
            14 ** multi +
            (CARD_VALUES[firstCountCard] * multi +
                CARD_VALUES[secondCountCard]) *
                multi
        )
    }

    if (firstCount === 3) {
        // three-of-a-kind
        const multi = 5

        return strength + 14 ** multi + CARD_VALUES[firstCountCard] * multi
    }

    if (firstCount === 2 && secondCount === 2) {
        // two pair
        const multi = 4

        return (
            strength +
            14 ** multi +
            (CARD_VALUES[firstCountCard] * multi +
                CARD_VALUES[secondCountCard]) *
                multi
        )
    }

    if (firstCount === 2) {
        // one pair
        const multi = 3

        return strength + 14 ** 3 + CARD_VALUES[firstCountCard] * multi
    }

    return strength
}

function partOne() {
    const hands = parseInput("src/07/input.test.txt")
    // const hands = parseInput("src/07/input.txt")

    const out: HandStrengths[] = []
    for (const hand of hands) {
        out.push({ ...hand, strength: calcHandStrength(hand.cards) })
    }

    const sorted = out.sort((a, b) => a.strength - b.strength)

    const points = []
    for (let rank = 1; rank <= sorted.length; rank += 1) {
        const s = sorted[rank - 1]
        points.push(s.bid * rank)
    }

    return points.reduce((prev, curr) => prev + curr)
}

function partTwo() {}

console.log("DAY 7")
console.log(partOne())
// console.log(partTwo())
