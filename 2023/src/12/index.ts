// https://adventofcode.com/2023/day/12

import readInputFile from "../readFile"

type States = -1 | 0 | 1
type Springs = { states: States[]; damaged: number[] }
const SPRING_STATES = ["?", "#", "."]

function parseInput(path: string): Springs[] {
    const file = readInputFile(path)
    if (!file) throw "Invalid file path."

    const lines = file.split("\r\n")
    const out = []
    for (const line of lines) {
        const [states, damaged] = line.split(" ")

        const obj: Springs = {
            states: states
                .split("")
                .map((s) => (SPRING_STATES.indexOf(s) - 1) as States),
            damaged: damaged.split(",").map((s) => +s),
        }

        out.push(obj)
    }

    return out
}

function partOne(records: Springs[]) {
    for (const rec of records) {
        console.log(rec)
    }
}

function partTwo(records: Springs[]) {}

const input = parseInput("src/12/input.test.txt")
// const input = parseInput("src/12/input.txt")
console.log("DAY 12")
console.log(partOne(input))
// console.log(partTwo(input))
