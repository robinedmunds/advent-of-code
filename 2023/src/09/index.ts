// https://adventofcode.com/2023/day/9

import readInputFile from "../readFile"

function parseInput(path: string): number[][] {
    const file = readInputFile(path)
    if (!file) throw "Invalid file path."

    return file.split("\r\n").map((line) => line.split(" ").map((s) => +s))
}

function calcDiff(a: number, b: number): number {
    const diff = Math.abs(a - b)

    if (a - b > 0) {
        return -diff
    }

    return diff
}

function solveSequence(seq: number[]): number {
    const pyramid: number[][] = [seq.slice()]

    // build inverted pyramid
    let rowIdx = 0
    while (!pyramid[pyramid.length - 1].every((n) => n === 0)) {
        const newRow = []
        for (let i = 0; i < pyramid[rowIdx].length - 1; i += 1) {
            newRow.push(calcDiff(pyramid[rowIdx][i], pyramid[rowIdx][i + 1]))
        }
        pyramid.push(newRow)
        rowIdx += 1
    }

    // add right-most elements, bottom to top
    pyramid[rowIdx].push(0)
    while (rowIdx > 0) {
        const lastIdx = pyramid[rowIdx].length - 1
        pyramid[rowIdx - 1].push(
            pyramid[rowIdx][lastIdx] + pyramid[rowIdx - 1][lastIdx]
        )
        rowIdx -= 1
    }

    return pyramid[0][pyramid[0].length - 1]
}

function partOne(input: number[][]) {
    const histories: number[] = []
    for (const seq of input) {
        histories.push(solveSequence(seq))
    }

    return histories.reduce((prev, curr) => prev + curr)
}

function partTwo() {}

const input = parseInput("src/09/input.txt")
const input2 = parseInput("src/09/input.test.txt")

console.log("DAY 9")
console.log(partOne(input)) // 2008960228
// console.log(partTwo())
