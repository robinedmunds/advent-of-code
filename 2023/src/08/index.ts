// https://adventofcode.com/2023/day/8

import readInputFile from "../readFile"

type LeftRight = (0 | 1)[]
type HMap = Map<string, [string, string]>

const FILTER = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789 " as const

function parseInput(path: string) {
    const file = readInputFile(path)
    if (!file) throw "Parsing error!"

    const [line1, block] = file.split("\r\n\r\n")
    const directions: LeftRight = line1
        .split("")
        .map((s) => (s === "L" ? 0 : 1)) as (0 | 1)[]
    const rows = block.split("\r\n").map((line) =>
        line
            .split("")
            .filter((c) => FILTER.includes(c))
            .join("")
            .split(" ")
            .filter((c) => c !== "")
    ) as [string, string, string][]

    const map: HMap = new Map()
    for (const row of rows) {
        map.set(row[0], row.slice(1, 3) as [string, string])
    }

    return { directions, map }
}

function partOne() {
    // const { directions, map } = parseInput("src/08/input.test.txt")
    // const { directions, map } = parseInput("src/08/input.test2.txt")
    const { directions, map } = parseInput("src/08/input.txt")

    return walk(directions, map, "AAA", (s: string) => s === "ZZZ")
}

function walk(
    directions: LeftRight,
    map: HMap,
    start: string,
    breakCondition: Function
) {
    let count = 0
    let curr = start
    while (!breakCondition(curr)) {
        const nextStep = directions[count % directions.length]
        const mapRow = map.get(curr)
        if (!mapRow) throw "Error: This should never happen!"
        curr = mapRow[nextStep]
        count += 1
    }

    return count
}

function partTwo() {
    // const { directions, map } = parseInput("src/08/input.test3.txt")
    const { directions, map } = parseInput("src/08/input.txt")
    const startNodes = [...map.keys()].filter((k) => k.endsWith("A"))

    const counts: number[] = []
    for (const start of startNodes) {
        counts.push(
            walk(directions, map, start, (s: string) => s.endsWith("Z"))
        )
    }

    return counts
}

console.log("DAY 8")
console.log(partOne()) // 12737
console.log("least common multiple of:", partTwo()) // 9064949303801
