// https://adventofcode.com/2023/day/8

import readInputFile from "../readFile"

const FILTER = "ABCDEFGHIJKLMNOPQRSTUVWXYZ " as const

function parseInput(path: string) {
    const file = readInputFile(path)
    if (!file) throw "Parsing error!"

    const [line1, block] = file.split("\r\n\r\n")
    const directions = line1.split("").map((s) => (s === "L" ? 0 : 1)) as (
        | 0
        | 1
    )[]
    const rows = block.split("\r\n").map((line) =>
        line
            .split("")
            .filter((c) => FILTER.includes(c))
            .join("")
            .split(" ")
            .filter((c) => c !== "")
    ) as [string, string, string][]

    const map: Map<string, [string, string]> = new Map()
    for (const row of rows) {
        map.set(row[0], row.slice(1, 3) as [string, string])
    }

    return { directions, map }
}

function partOne() {
    // const { directions, map } = parseInput("src/08/input.test.txt")
    // const { directions, map } = parseInput("src/08/input.test2.txt")
    const { directions, map } = parseInput("src/08/input.txt")

    let count = 0
    let curr = "AAA"
    while (curr !== "ZZZ") {
        const nextStep = directions[count % directions.length]
        const mapRow = map.get(curr)
        if (!mapRow) throw "this shold never happen"
        curr = mapRow[nextStep]
        count += 1
    }

    return count
}

function partTwo() {}

console.log("DAY 8")
console.log(partOne())
// console.log(partTwo())
