// https://adventofcode.com/2023/day/3

import readInputFile from "../readFile"

const DIGITS = "0123456789".split("")
const NON_SYMBOLS = ["."].concat(DIGITS)
const DIRECTIONS = [
    { x: 0, y: -1 }, // UP
    { x: 1, y: -1 }, // UP RIGHT
    { x: 1, y: 0 }, // RIGHT
    { x: 1, y: 1 }, // RIGHT DOWN
    { x: 0, y: 1 }, // DOWN
    { x: -1, y: 1 }, // DOWN LEFT
    { x: -1, y: 0 }, // LEFT
    { x: -1, y: -1 }, // UP LEFT
]

function parseInput(path: string) {
    const file = readInputFile(path)
    if (!file) return [""]

    return file.split("\r\n")
}

function partOne() {
    // const rows = parseInput("src/03/input.test.txt")
    const rows = parseInput("src/03/input.txt")
    const partNumbers = []
    let lastCharIsDigit = false
    let adjacentSymbolFound = false
    let buildNumber = ""

    for (let row = 0; row < rows.length; row += 1) {
        for (let col = 0; col < rows[row].length; col += 1) {
            if (DIGITS.includes(rows[row][col]) === false) {
                if (lastCharIsDigit === true && adjacentSymbolFound === true) {
                    partNumbers.push(+buildNumber)
                }

                lastCharIsDigit = false
                adjacentSymbolFound = false
                buildNumber = ""

                continue
            }

            for (const direction of DIRECTIONS) {
                if (
                    row + direction.y < 0 ||
                    row + direction.y > rows.length - 1 ||
                    col + direction.x < 0 ||
                    col + direction.x > rows[row].length - 1
                ) {
                    continue
                }

                if (
                    NON_SYMBOLS.includes(
                        rows[row + direction.y][col + direction.x]
                    ) === false
                ) {
                    adjacentSymbolFound = true
                    break
                }
            }

            buildNumber = `${buildNumber}${rows[row][col]}`
            lastCharIsDigit = true
        }
    }

    return partNumbers.reduce((prev, curr) => prev + curr)
}

function buildUniquePartNoMask(rows: string[]): number[][] {
    const idMask: number[][] = []
    let id = -1
    let lastCharIsDigit = false

    for (let row = 0; row < rows.length; row += 1) {
        const maskRow = []

        for (let col = 0; col < rows[row].length; col += 1) {
            if (DIGITS.includes(rows[row][col]) === false) {
                lastCharIsDigit = false
                maskRow.push(-1)

                continue
            }

            if (lastCharIsDigit === false) {
                id += 1
            }

            lastCharIsDigit = true
            maskRow.push(id)
        }

        lastCharIsDigit = false
        idMask.push(maskRow)
    }

    return idMask
}

function buildMaskToPartNoLookUp(rows: string[]): number[] {
    const partNumbers = []
    let lastCharIsDigit = false
    let buildNumber = ""

    for (let row = 0; row < rows.length; row += 1) {
        for (let col = 0; col < rows[row].length; col += 1) {
            if (DIGITS.includes(rows[row][col]) === false) {
                if (lastCharIsDigit === true) {
                    partNumbers.push(+buildNumber)
                }

                lastCharIsDigit = false
                buildNumber = ""

                continue
            }

            buildNumber = `${buildNumber}${rows[row][col]}`
            lastCharIsDigit = true
        }
    }

    return partNumbers
}

function partTwo() {
    // const rows = parseInput("src/03/input.test.txt")
    const rows = parseInput("src/03/input.txt")
    const partNoMask = buildUniquePartNoMask(rows)
    const adjacentMasks = []

    for (let row = 0; row < rows.length; row += 1) {
        for (let col = 0; col < rows[row].length; col += 1) {
            if (rows[row][col] !== "*") continue

            const adjacents: number[] = []
            for (const direction of DIRECTIONS) {
                // out of bounds checks
                if (
                    row + direction.y < 0 ||
                    row + direction.y > rows.length - 1 ||
                    col + direction.x < 0 ||
                    col + direction.x > rows[row].length - 1
                ) {
                    continue
                }

                const adj = partNoMask[row + direction.y][col + direction.x]
                if (adj < 0 || adjacents.includes(adj)) continue

                adjacents.push(adj)
            }

            adjacentMasks.push(adjacents)
        }
    }

    const lookup = buildMaskToPartNoLookUp(rows)
    const output = []

    for (let idx = 0; idx < adjacentMasks.length; idx += 1) {
        const pair = adjacentMasks[idx]

        if (pair.length !== 2) {
            continue
        }

        output.push(lookup[pair[0]] * lookup[pair[1]])
    }

    return output.reduce((prev, curr) => prev + curr)
}

console.log("DAY 3")
console.log(partOne())
console.log(partTwo())

// 467..114..
// ...*......
// ..35..633.
// ......#...
// 617*......
// .....+.58.
// ..592.....
// ......755.
// ...$.*....
// .664.598..
