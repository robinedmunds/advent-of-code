// https://adventofcode.com/2023/day/7

import readInputFile from "../readFile"

const CARDS = [
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "T",
    "J",
    "Q",
    "K",
    "A",
] as const

type Card = (typeof CARDS)[number]
type Hand = {
    cards: [Card, Card, Card, Card, Card]
    bid: number
}

function getCardValue(card: Card): number {
    const idx = CARDS.indexOf(card)
    if (idx === -1) throw "This can't happen."

    return idx + 2
}

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

function calcHandType(cards: Card[]): number {
    const cardCount: Map<Card, number> = new Map()

    for (const card of cards) {
        const curr = cardCount.get(card) ?? 0
        cardCount.set(card, curr + 1)
    }

    const countsDesc = [...cardCount.entries()].sort((a, b) => b[1] - a[1])

    if (countsDesc[0][1] === 5) {
        // five-of-a-kind
        return 10 ** 14 * getCardValue(countsDesc[0][0])
    }

    if (countsDesc[0][1] === 4) {
        // four-of-a-kind
        return 10 ** 12 * getCardValue(countsDesc[0][0])
    }

    if (countsDesc[0][1] === 3 && countsDesc[1][1] === 2) {
        // full house
        return (
            10 ** 10 * getCardValue(countsDesc[0][0]) +
            getCardValue(countsDesc[1][0])
        )
    }

    if (countsDesc[0][1] === 3) {
        // three-of-a-kind
        return 10 ** 8 * getCardValue(countsDesc[0][0])
    }

    if (countsDesc[0][1] === 2 && countsDesc[1][1] === 2) {
        // two pair
        return (
            10 ** 6 * getCardValue(countsDesc[0][0]) +
            getCardValue(countsDesc[1][0])
        )
    }

    if (countsDesc[0][1] === 2) {
        // one pair
        return 10 ** 4 * getCardValue(countsDesc[0][0])
    }

    return countsDesc
        .map(([card]) => getCardValue(card))
        .reduce((prev, curr, idx, arr) => prev + curr * (arr.length - idx + 1))
}

function calcOrderValue(cards: Card[]): number {
    let out = 0

    for (let multiplier = cards.length; multiplier > 0; multiplier -= 1) {
        out += multiplier * getCardValue(cards[cards.length - multiplier])
    }

    return out
}

type Winnings = Hand & { winnings: number }

function partOne() {
    const hands = parseInput("src/07/input.test.txt")
    // const hands = parseInput("src/07/input.txt")

    // calc and rank hand strengths
    const out: Winnings[] = []
    for (const hand of hands) {
        out.push({
            ...hand,
            winnings: calcHandType(hand.cards) + calcOrderValue(hand.cards),
        })
    }

    out.sort((a, b) => a.winnings - b.winnings)

    let totalWinnings = 0
    for (let rank = 1; rank <= out.length; rank += 1) {
        console.log(out[rank - 1], rank)

        totalWinnings += out[rank - 1].bid * rank
    }

    return totalWinnings
}

function partTwo() {}

console.log("DAY 7")
console.log(partOne())
// console.log(partTwo())
