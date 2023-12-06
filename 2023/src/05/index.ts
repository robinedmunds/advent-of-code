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

type Range = { start: number; end: number }

function buildSeedRanges(seeds: number[]): Range[] {
    const output = []

    for (let i = 0; i < seeds.length; i += 2) {
        const start = seeds[i]
        const range = seeds[i + 1]
        output.push({ start, end: start + range - 1 })
    }

    return output
}

function memoize(func: Function, maps: Map<string, number[][]>): Function {
    const cache = new Map()

    return (seed: number): any => {
        const key = JSON.stringify(seed)

        if (cache.has(key)) {
            return cache.get(key)
        }

        const result: any = func(seed, maps)
        cache.set(key, result)

        return result
    }
}

function calcSeedChain(seed: number, maps: Map<string, number[][]>): number {
    let currSeed = seed

    for (const mapKey of maps.keys()) {
        const nextSeed = calcDestination(currSeed, maps.get(mapKey) ?? [])
        currSeed = nextSeed
    }

    return currSeed
}

function flattenRanges(ranges: Range[]): Range[] {
    const sortedAsc = ranges.sort((a, b) => a.start - b.start)
    const output = []

    let curr = sortedAsc[0]

    for (let i = 1; i < sortedAsc.length; i += 1) {
        const next = sortedAsc[i]

        if (next.start <= curr.end) {
            curr.end = Math.max(curr.end, next.end)
        } else {
            output.push(curr)
            curr = next
        }
    }

    output.push(curr)

    return output
}

function partTwo() {
    const { seeds, maps } = parseInput("src/05/input.test.txt")
    // const { seeds, maps } = parseInput("src/05/input.txt")
    const seedRanges = buildSeedRanges(seeds)
    const memoCalcSeedChain = memoize(calcSeedChain, maps)

    let smallestLocation = Infinity
    for (const { start, end } of flattenRanges(seedRanges)) {
        for (let seed = start; seed <= end; seed += 1) {
            const location = calcSeedChain(seed, maps)

            if (location < smallestLocation) {
                smallestLocation = location
            }
        }
    }

    return smallestLocation
}

console.log("DAY 5")
// console.log(partOne())
console.log(partTwo())
