// https://adventofcode.com/2023/day/4

import readInputFile from "../readFile"

function parseInput(path: string) {
    const file = readInputFile(path)
    if (!file) return [[]]
    const lines = file.split("\r\n")
    const leftRightStr = lines.map((line) => line.split(": ")[1].split(" | "))
    const leftRight = leftRightStr.map((card) =>
        card.map((side) =>
            side
                .split(" ")
                .map((n) => +n)
                .filter((n) => n > 0)
        )
    )

    return leftRight
}

// const CARDS = parseInput("src/04/input.test.txt")
const CARDS = parseInput("src/04/input.txt")

function calcCardScore(matchCount: number): number {
    if (matchCount === 0) return 0
    let score = 1

    for (let i = 1; i < matchCount; i += 1) {
        score *= 2
    }

    return score
}

function partOne() {
    const cards = CARDS
    const matchCounts = []

    for (const card of cards) {
        const [winningNums, haves] = card
        let matchCount = 0

        for (const have of haves) {
            if (winningNums.includes(have)) {
                matchCount += 1
            }
        }

        matchCounts.push(matchCount)
    }

    const cardScores = matchCounts.map((c) => calcCardScore(c))

    return cardScores.reduce((prev, curr) => prev + curr)
}

function recurse(originals: number[], total: number[], currIdx: number) {
    const copies = originals[currIdx]
    if (copies === 0) return

    total[0] += copies

    for (let i = currIdx + 1; i <= currIdx + copies; i += 1) {
        recurse(originals, total, i)
    }
}

function partTwo() {
    const cards = CARDS
    const tracking = []

    for (const card of cards) {
        const [winningNums, haves] = card
        let matchCount = 0

        for (const have of haves) {
            if (winningNums.includes(have)) {
                matchCount += 1
            }
        }

        tracking.push(matchCount)
    }

    const total = [tracking.length]

    for (let i = 0; i < tracking.length; i += 1) {
        recurse(tracking, total, i)
    }

    return total[0]
}

console.log("DAY 4")
console.log(partOne())
console.log(partTwo())
