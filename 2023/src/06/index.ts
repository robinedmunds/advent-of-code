// https://adventofcode.com/2023/day/6

import readInputFile from "../readFile"

type RaceResult = { time: number; distance: number }

function parseInput(path: string) {
    const file = readInputFile(path)
    if (!file) return

    const grid = file.split("\r\n").map((line) =>
        line
            .split(" ")
            .filter((s) => s !== "" && !s.includes(":"))
            .map((s) => +s)
    )

    const output: RaceResult[] = []
    for (let i = 0; i < grid[0].length; i += 1) {
        output.push({ time: grid[0][i], distance: grid[1][i] })
    }

    return output
}

function partOne() {
    const raceRecords = parseInput("src/06/input.test.txt")
    console.log(raceRecords)
}

function partTwo() {}

console.log("DAY 6")
console.log(partOne())
// console.log(partTwo())
