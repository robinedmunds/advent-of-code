// https://adventofcode.com/2023/day/5

import readInputFile from "../readFile"

function parseInput(path: string) {
    const file = readInputFile(path)
    if (!file) return { seeds: [], maps: new Map() }

    const blocks = file.split("\r\n\r\n")
    const seeds = blocks[0]
        .split(": ")[1]
        .split(" ")
        .map((s) => +s)

    const hashMap: Map<string, number[][]> = new Map()
    for (let idx = 1; idx < blocks.length; idx += 1) {
        const label = blocks[idx].split("\r\n")[0].split(" ")[0]
        const blockRows = blocks[idx]
            .split("\r\n")
            .slice(1)
            .map((s) => s.split(" ").map((s) => +s))

        hashMap.set(label, blockRows)
    }

    return { seeds, maps: hashMap }
}

function calcDestination(seed: number, map: number[][]): number {
    let output = seed

    for (const row of map) {
        const [destStart, sourceStart, range] = row
        if (seed < sourceStart || seed >= sourceStart + range) continue

        const diff = seed - sourceStart
        output = destStart + diff
    }

    return output
}

function partOne() {
    const { seeds, maps } = parseInput("src/05/input.txt")
    const results: Map<string, number>[] = []

    for (const seed of seeds) {
        const result: Map<string, number> = new Map()
        let currSeed = seed

        for (const mapKey of maps.keys()) {
            const label = mapKey.split("-to-")[1]
            const nextSeed = calcDestination(currSeed, maps.get(mapKey))
            result.set(label, nextSeed)
            currSeed = nextSeed
        }

        results.push(result)
    }

    return Math.min(...results.map((m) => m.get("location") ?? Infinity))
}

console.log("DAY 5")
console.log(partOne())
// console.log(partTwo())
