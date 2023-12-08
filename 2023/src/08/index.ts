// https://adventofcode.com/2023/day/8

import readInputFile from "../readFile"

const FILTER = "ABCDEFGHIJKLMNOPQRSTUVWXYZ " as const

function parseInput(path: string) {
    const file = readInputFile(path)
    if (!file) throw "Parsing error!"

    const [line1, block] = file.split("\r\n\r\n")
    const directions = line1.split("") as ("L" | "R")[]
    const map: [string, string, string][] = block.split("\r\n").map((line) =>
        line
            .split("")
            .filter((c) => FILTER.includes(c))
            .join("")
            .split(" ")
            .filter((c) => c !== "")
    ) as [string, string, string][]

    const hashMap: Map<string, [string, string]> = new Map()

    for (let i = 0; i < map.length; i += 1) {
        hashMap.set(map[i][0], map[i].slice(1, 3) as [string, string])
    }

    return { directions, hashMap }
}

function partOne() {
    const { directions, hashMap } = parseInput("src/08/input.test2.txt")
    // const { directions, hashMap } = parseInput("src/08/input.txt")

    console.log(hashMap)
    let dirIdx = 0
    let step = [...hashMap.keys()][0]
    let stepCount = 0

    while (step !== "ZZZ") {
        console.log(step, stepCount)

        const pair = hashMap.get(step)
        if (!pair) throw "This should never happen!"
        const [left, right] = pair

        if (directions[dirIdx] === "L") {
            step = left
        }

        if (directions[dirIdx] === "R") {
            step = right
        }

        dirIdx += 1
        if (dirIdx >= directions.length) {
            dirIdx = 0
        }

        stepCount += 1
    }

    console.log(step, stepCount)
}

function partTwo() {}

console.log("DAY 8")
console.log(partOne())
// console.log(partTwo())
