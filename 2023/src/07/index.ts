// https://adventofcode.com/2023/day/7

import readInputFile from "../readFile"

const CARDS = "23456789TJQKA" as const
const CARDS_JOKER = "J23456789TQKA" as const
const HAND_TYPES = [
    "high-card",
    "one-pair",
    "two-pair",
    "three-of-a-kind",
    "full-house",
    "four-of-a-kind",
    "five-of-a-kind",
] as const
type Card =
    | "A"
    | "K"
    | "Q"
    | "J"
    | "T"
    | "9"
    | "8"
    | "7"
    | "6"
    | "5"
    | "4"
    | "3"
    | "2"
type Cards = [Card, Card, Card, Card, Card]
type Hand = {
    cards: Cards
    bid: number
}
type HandWithType = Hand & { type: (typeof HAND_TYPES)[number] }

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

function processHandType(hand: Hand, joker?: boolean) {
    const cardCounts: number[] = Array(CARDS.length).fill(0)

    for (const card of hand.cards) {
        const cardIdx = CARDS.indexOf(card)
        cardCounts[cardIdx] += 1
    }

    const jokerIdx = CARDS.indexOf("J")
    const jokerCount = joker === true ? cardCounts[jokerIdx] : 0
    if (joker === true) {
        for (let i = 0; i < cardCounts.length; i += 1) {
            if (i === jokerIdx) continue
            if (cardCounts[i] === 0) continue
            cardCounts[i] += jokerCount
        }
    }

    cardCounts.sort((a, b) => b - a) //desc

    if (cardCounts[0] >= 5) {
        return { ...hand, type: "five-of-a-kind" } as HandWithType
    }

    if (cardCounts[0] >= 4) {
        return { ...hand, type: "four-of-a-kind" } as HandWithType
    }

    if (cardCounts[0] >= 3 && cardCounts[1] - jokerCount >= 2) {
        return { ...hand, type: "full-house" } as HandWithType
    }

    if (cardCounts[0] >= 3) {
        return { ...hand, type: "three-of-a-kind" } as HandWithType
    }

    if (cardCounts[0] >= 2 && cardCounts[1] - jokerCount >= 2) {
        return { ...hand, type: "two-pair" } as HandWithType
    }

    if (cardCounts[0] >= 2) {
        return { ...hand, type: "one-pair" } as HandWithType
    }

    return { ...hand, type: "high-card" } as HandWithType
}

function customSortAsc(a: HandWithType, b: HandWithType): number {
    let A = (HAND_TYPES.indexOf(a.type) + 1) * 10000
    let B = (HAND_TYPES.indexOf(b.type) + 1) * 10000

    for (let i = a.cards.length; i > 0; i -= 1) {
        const cardA = CARDS.indexOf(a.cards[a.cards.length - i])
        const cardB = CARDS.indexOf(b.cards[a.cards.length - i])

        A += cardA + i
        B += cardB + i

        if (A - B !== 0) return A - B
    }

    return A - B
}

function customSortAscJoker(a: HandWithType, b: HandWithType): number {
    let A = (HAND_TYPES.indexOf(a.type) + 1) * 10000
    let B = (HAND_TYPES.indexOf(b.type) + 1) * 10000

    for (let i = a.cards.length; i > 0; i -= 1) {
        const cardA = CARDS_JOKER.indexOf(a.cards[a.cards.length - i])
        const cardB = CARDS_JOKER.indexOf(b.cards[a.cards.length - i])

        A += cardA + i
        B += cardB + i

        if (A - B !== 0) return A - B
    }

    return A - B
}

function partOne(input: Hand[]) {
    const hands: HandWithType[] = input
        .map((h) => processHandType(h))
        .sort(customSortAsc)

    let bidTotal: number = 0
    for (let rank = 1; rank <= hands.length; rank += 1) {
        bidTotal += rank * hands[rank - 1].bid
    }

    return bidTotal
}

function partTwo(input: Hand[]) {
    const hands: HandWithType[] = input
        .map((h) => processHandType(h, true))
        .sort(customSortAscJoker)

    let bidTotal: number = 0
    for (let rank = 1; rank <= hands.length; rank += 1) {
        bidTotal += rank * hands[rank - 1].bid
    }

    return bidTotal
}

const hands = parseInput("src/07/input.txt")

console.log("DAY 7")
console.log(partOne(hands))
console.log(partTwo(hands))
