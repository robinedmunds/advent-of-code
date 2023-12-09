// https://adventofcode.com/2023/day/9

import readInputFile from "../readFile"

function parseInput(path: string): number[][] {
    const file = readInputFile(path)
    if (!file) throw "Invalid file path."

    return file.split("\r\n").map((line) => line.split(" ").map((s) => +s))
}

function calcDifference(a: number, b: number): number {
    const largest = Math.max(a, b)
    const smallest = Math.min(a, b)

    if (largest < 0 || smallest < 0) {
        // one negative
        return largest + Math.abs(smallest)
    }
    // both positive or both negative
    return largest - smallest
}

function solveSequence(seq: number[]): number {
    const container: number[][] = [seq.slice()]

    // build inverted pyramid

    let rowIdx = 0
    while (!container[container.length - 1].every((n) => n === 0)) {
        const newRow = []
        for (let i = 0; i < container[rowIdx].length - 1; i += 1) {
            newRow.push(
                calcDifference(container[rowIdx][i], container[rowIdx][i + 1])
            )
        }

        container.push(newRow)
        rowIdx += 1
    }

    // add right-most elements, bottom to top

    container[rowIdx].push(0)
    let diff = container[rowIdx - 1][container[rowIdx - 1].length - 1]

    while (rowIdx > 0) {
        diff = container[rowIdx][container[rowIdx].length - 1]
        container[rowIdx - 1].push(
            container[rowIdx - 1][container[rowIdx - 1].length - 1] + diff
        )
        rowIdx -= 1
    }

    // for (const was of container) {
    //     console.log(was.length, was)
    // }

    return container[0][container[0].length - 1]
}

function partOne(input: number[][]) {
    const histories: number[] = []
    for (const seq of input) {
        histories.push(solveSequence(seq))
    }

    return histories.reduce((prev, curr) => prev + curr)
}

function partTwo() {}

const input = parseInput("src/09/input.test.txt")
const input2 = parseInput("src/09/input.txt")

console.log("DAY 9")
console.log(partOne(input))
console.log(partOne(input2))
// console.log(partTwo())
