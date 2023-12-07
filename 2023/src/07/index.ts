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

enum HAND_TYPES {
    fiveOfAKind = 900,
    fourOfAKind = 800,
    fullHouse = 700,
    threeOfAKind = 600,
    twoPair = 500,
    onePair = 400,
    highCard = 300,
}

type Card = keyof typeof CARD_VALUES
type Cards = [Card, Card, Card, Card, Card]
type Hand = { cards: Cards; bid: number }
type HandStrengths = Hand & { strength: HAND_TYPES }

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

function calcHandStrength(cards: Cards) {
    const instanceCount: Map<Card, number> = new Map()

    for (const card of cards) {
        const currCount = instanceCount.get(card) ?? 0
        instanceCount.set(card, currCount + 1)
    }

    const instanceCountDesc = [...instanceCount.entries()].sort(
        (a, b) => b[1] - a[1]
    )

    const firstCount: number = instanceCountDesc[0][1]

    if (firstCount === 5) {
        return HAND_TYPES.fiveOfAKind
    }

    const secondCount: number = instanceCountDesc[1][1]

    if (firstCount === 4) {
        return HAND_TYPES.fourOfAKind
    }

    if (firstCount === 3 && secondCount === 2) {
        return HAND_TYPES.fullHouse
    }

    if (firstCount === 3) {
        return HAND_TYPES.threeOfAKind
    }

    if (firstCount === 2 && secondCount === 2) {
        return HAND_TYPES.twoPair
    }

    if (firstCount === 2) {
        return HAND_TYPES.onePair
    }

    return HAND_TYPES.highCard
}

function partOne() {
    // const hands = parseInput("src/07/input.test.txt")
    const hands = parseInput("src/07/input.txt")

    const strengths: HandStrengths[] = []
    for (const hand of hands) {
        strengths.push({ ...hand, strength: calcHandStrength(hand.cards) })
    }

    const strengthsAsc = [...strengths].sort((a, b) => {
        const diff = a.strength - b.strength
        if (diff !== 0) return diff

        for (let i = 0; i < a.cards.length; i += 1) {
            const cardA = CARD_VALUES[a.cards[i]]
            const cardB = CARD_VALUES[b.cards[i]]

            if (cardA - cardB === 0) continue

            return cardA - cardB
        }

        throw "strengthsAsc sort: This should never happen!"
    })

    const points: number[] = []
    for (let rank = 1; rank <= strengthsAsc.length; rank += 1) {
        const hand = strengthsAsc[rank - 1]
        points.push(hand.bid * rank)
    }

    return points.reduce((prev, curr) => prev + curr)
}

function partTwo() {}

console.log("DAY 7")
console.log(partOne())
// console.log(partTwo())
