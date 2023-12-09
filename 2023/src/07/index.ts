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
} as const

enum HAND_TYPES {
    fiveOfAKind = 70,
    fourOfAKind = 60,
    fullHouse = 50,
    threeOfAKind = 40,
    twoPair = 30,
    onePair = 20,
    highCard = 10,
}

type Card = keyof typeof CARD_VALUES
type Cards = [Card, Card, Card, Card, Card]
type Hand = { cards: Cards; bid: number }
type HandStrengths = Hand & { strength: HAND_TYPES }

// PART 2 types
const JOKER_CARD_VALUES = { ...CARD_VALUES, J: 1 } as const
// type JCard = keyof typeof JOKER_CARD_VALUES
// type JCards = [JCard, JCard, JCard, JCard, JCard]
// type JHand = { cards: JCards; bid: number }
// type JHandStrengths = JCards & { strength: HAND_TYPES }

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

function calcHandStrengthJ(cards: Cards) {
    const instanceCount: Map<Card, number> = new Map()

    for (const card of cards) {
        const currCount = instanceCount.get(card) ?? 0
        instanceCount.set(card, currCount + 1)
    }

    const jackCount = instanceCount.get("J") ?? 0

    for (const [key, value] of instanceCount.entries()) {
        if (key === "J") continue
        if (jackCount === 0) break

        instanceCount.set(key, value + jackCount)
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

    if (firstCount >= 3 && secondCount >= 2) {
        return HAND_TYPES.fullHouse
    }

    if (firstCount >= 3) {
        return HAND_TYPES.threeOfAKind
    }

    if (firstCount >= 2 && secondCount >= 2) {
        return HAND_TYPES.twoPair
    }

    if (firstCount >= 2) {
        return HAND_TYPES.onePair
    }

    return HAND_TYPES.highCard
}

function rankSortAsc(a: HandStrengths, b: HandStrengths): number {
    let sumA = 0
    let sumB = 0

    for (let i = a.cards.length + 1; i > 0; i -= 1) {
        sumA += JOKER_CARD_VALUES[a.cards[a.cards.length - i + 1]] ** i
        sumB += JOKER_CARD_VALUES[b.cards[a.cards.length - i + 1]] ** i
    }

    return sumA - sumB
}

function partTwo() {
    // const hands = parseInput("src/07/input.test.txt")
    const hands = parseInput("src/07/input.txt")

    const strengths: HandStrengths[] = []
    for (const hand of hands) {
        strengths.push({ ...hand, strength: calcHandStrengthJ(hand.cards) })
    }

    const strengthsAsc = [...strengths].sort((a, b) => {
        const diff = a.strength - b.strength
        if (diff !== 0) return diff

        for (let i = 0; i < a.cards.length; i += 1) {
            const cardA = JOKER_CARD_VALUES[a.cards[i]]
            const cardB = JOKER_CARD_VALUES[b.cards[i]]

            if (cardA - cardB === 0) continue

            return cardA - cardB
        }

        throw "strengthsAsc sort: This should never happen!"
    })
    const points: number[] = []
    for (let rank = 1; rank <= strengthsAsc.length; rank += 1) {
        const hand = strengthsAsc[rank - 1]
        points.push(hand.bid * rank)

        // console.log(rank, hand)
    }

    return points.reduce((prev, curr) => prev + curr)
}

console.log("DAY 7")
// console.log(partOne())
console.log(partTwo())

function tests() {
    const examples: Cards[] = [
        ["Q", "Q", "Q", "Q", "Q"],
        ["Q", "Q", "Q", "Q", "2"],
        ["Q", "Q", "Q", "2", "2"],
        ["Q", "Q", "Q", "2", "4"],
        ["Q", "Q", "2", "2", "4"],
        ["Q", "Q", "2", "8", "4"],
        ["A", "Q", "2", "8", "4"],
        // adfadsf
        ["J", "J", "J", "J", "J"],
        ["J", "J", "J", "J", "2"],
        ["J", "J", "J", "2", "2"],
        ["J", "J", "2", "2", "2"],
        ["J", "2", "2", "2", "2"],
        ["J", "J", "J", "2", "3"],
        ["J", "J", "2", "2", "3"],
        ["J", "2", "2", "2", "3"],
    ]

    for (const ex of examples) {
        console.log(ex.join(""), calcHandStrengthJ(ex))
    }
}

// tests()
