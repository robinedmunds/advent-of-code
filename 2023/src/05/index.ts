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

function calcSeedChain(seed: number, maps: Map<string, number[][]>): number {
    let currSeed = seed

    for (const mapKey of maps.keys()) {
        const nextSeed = calcDestination(currSeed, maps.get(mapKey) ?? [])
        currSeed = nextSeed
    }

    return currSeed
}

// function calcMapEnds(maps: Map<string, number[][]>) {
//     const output: Map<
//         string,
//         {
//             lowestSeed: number
//             lowestSeedLocation: number
//             highestSeed: number
//             highestSeedLocation: number
//         }[]
//     > = new Map()

//     for (const mapKey of maps.keys()) {
//         const mapArr = maps.get(mapKey)
//         if (!mapArr) throw "This can never happen!"

//         const lines = []
//         for (const map of mapArr) {
//             const [dest, source, range] = map
//             const lowestSeed = source
//             const lowestSeedLocation = calcSeedChain(source, maps)
//             const highestSeed = source + range - 1
//             const highestSeedLocation = calcSeedChain(highestSeed, maps)
//             lines.push({
//                 lowestSeed,
//                 lowestSeedLocation,
//                 highestSeed,
//                 highestSeedLocation,
//             })
//         }

//         output.set(mapKey, lines)
//     }

//     console.log(output)

//     return output
// }

function calcMapEnds(maps: Map<string, number[][]>) {
    const output: {
        lowestSeed: number
        lowestSeedLocation: number
        highestSeed: number
        highestSeedLocation: number
    }[] = []

    const seedToSoil = maps.get("seed-to-soil")
    if (!seedToSoil) throw "This can never happen!"

    for (const map of seedToSoil) {
        const [, source, range] = map
        const lowestSeed = source
        const lowestSeedLocation = calcSeedChain(source, maps)
        const highestSeed = source + range - 1
        const highestSeedLocation = calcSeedChain(highestSeed, maps)
        output.push({
            lowestSeed,
            lowestSeedLocation,
            highestSeed,
            highestSeedLocation,
        })
    }

    console.log(output)

    return output
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

function binarySearch(
    maps: Map<string, number[][]>,
    range: Range,
    smallest: number[],
    curr: number
) {
    if (range.end - range.start <= 1) {
        smallest.push(curr)

        return
    }

    const half = Math.floor((range.end - range.start) / 2)
    const quarter = Math.floor(half / 2)
    const left = calcSeedChain(range.start + quarter, maps)
    const right = calcSeedChain(range.end - quarter, maps)

    if (left < right) {
        binarySearch(
            maps,
            { start: range.start, end: range.start + half },
            smallest,
            left
        )
    } else {
        binarySearch(
            maps,
            {
                start: range.start + half + 1,
                end: range.end,
            },
            smallest,
            right
        )
    }
}

function partTwo() {
    const { seeds, maps } = parseInput("src/05/input.test.txt")
    // const { seeds, maps } = parseInput("src/05/input.txt")
    const seedRanges = flattenRanges(buildSeedRanges(seeds))
    const smallest: number[] = []

    const endMaps = calcMapEnds(maps)

    for (const range of seedRanges) {
        let lowest = Infinity

        for (const endMap of endMaps) {
            if (
                // range fully enclosed by map
                range.start > endMap.lowestSeed &&
                range.end < endMap.highestSeed
            ) {
                continue
            }

            if (
                range.start <= endMap.lowestSeed &&
                range.end >= endMap.highestSeed
            ) {
                // map fully enclosed by range

                lowest = Math.min(
                    lowest,
                    endMap.lowestSeedLocation,
                    endMap.highestSeedLocation
                )
            }

            if (
                range.start <= endMap.lowestSeed &&
                range.end < endMap.highestSeed
            ) {
                lowest = Math.min(lowest, endMap.lowestSeedLocation)
            }

            if (
                range.start > endMap.lowestSeed &&
                range.end >= endMap.highestSeed
            ) {
                lowest = Math.min(lowest, endMap.highestSeedLocation)
            }

            smallest.push(lowest)
        }
    }

    console.log(smallest)

    // for (const range of seedRanges) {
    //     // perform binary search for smallest location
    //     binarySearch(maps, range, smallest, Infinity)
    // }

    // console.log(smallest)

    // return Math.min(...smallest)
}

console.log("DAY 5")
// console.log(partOne())
console.log(partTwo())
