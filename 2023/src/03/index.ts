// https://adventofcode.com/2023/day/3

import readInputFile from "../readFile"

const DIGITS = "0123456789".split("")
const NON_SYMBOLS = ["."].concat(DIGITS)
const DIRECTIONS = [
    {
        // UP
        x: 0,
        y: -1,
    },
    {
        // UP_RIGHT
        x: 1,
        y: -1,
    },
    {
        // RIGHT
        x: 1,
        y: 0,
    },
    {
        // RIGHT_DOWN
        x: 1,
        y: 1,
    },
    {
        // DOWN
        x: 0,
        y: 1,
    },
    {
        // DOWN_LEFT
        x: -1,
        y: 1,
    },
    {
        // LEFT
        x: -1,
        y: 0,
    },
    {
        // UP_LEFT
        x: -1,
        y: -1,
    },
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

    // console.log(partNumbers)
    return partNumbers.reduce((prev, curr) => prev + curr)
}

console.log("DAY 3")
console.log(partOne())

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
