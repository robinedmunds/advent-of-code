// https://adventofcode.com/2023/day/8

import { dir } from "console"
import readInputFile from "../readFile"

type LeftRight = [left: string, right: string]

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

    const hashMap: Map<string, LeftRight> = new Map()

    for (let i = 0; i < map.length; i += 1) {
        hashMap.set(map[i][0], map[i].slice(1, 3) as LeftRight)
    }

    return { directions, hashMap }
}

function breakDirections(directions: ("L" | "R")[]) {
    const patterns: Map<string, number> = new Map()

    for (let start = 0; start < directions.length; start += 1) {
        for (let end = start + 1; end <= directions.length; end += 1) {
            if (end - start > Math.floor(Math.sqrt(directions.length))) break

            const pattern = directions.slice(start, end).join("")
            if ([...patterns.keys()].includes(pattern)) continue
            // console.log(pattern)
            let matches = 0

            for (let i = 0; i + pattern.length <= directions.length; i += 1) {
                if (
                    directions.slice(i, i + pattern.length).join("") === pattern
                ) {
                    matches += 1
                }
            }

            if (matches >= Math.floor(Math.sqrt(directions.length))) {
                patterns.set(pattern, matches)
            }
        }
    }

    // directions to block refs

    const refs: string[] = []
    for (let start = 0; start < directions.length; start += 1) {
        for (let end = directions.length; end > start; end -= 1) {
            const key = directions.slice(start, end).join("")

            if (patterns.has(key)) {
                refs.push(key)
                start = end - 1

                break
            }
        }
    }

    // console.log(refs)
    // console.log(refs.join("").length, directions.length)

    // console.log("matching?", refs.flat().join("") === directions.join(""))
    // console.log(refs.flat().join(""))
    // console.log(directions.join(""))

    // const decimalUnique = (refs.length - new Set(refs).size) / refs.length
    // console.log(decimalUnique, decimalUnique * refs.length)

    return refs
}

function processBlock(
    block: string,
    hashMap: Map<string, LeftRight>,
    stepKey: string
) {
    let stepCount = 0
    let currStepKey = stepKey

    for (let idx = 0; idx < block.length; idx += 1) {
        const pair = hashMap.get(currStepKey)
        if (!pair) throw "This should never happen!"
        const [left, right] = pair

        if (block[idx] === "L") {
            currStepKey = left
        }

        if (block[idx] === "R") {
            currStepKey = right
        }

        stepCount += 1

        if (currStepKey === "ZZZ") break
    }

    return { stepCount, lastStepKey: currStepKey }
}

function memoProcessBlock(): Function {
    // block: string,
    // hashMap: Map<string, LeftRight>,
    // stepKey: string
    const cache = new Map()

    return (
        block: string,
        hashMap: Map<string, LeftRight>,
        stepKey: string
    ) => {
        const key = block + "_" + stepKey

        if (cache.has(key)) {
            console.log(cache.size)
            return cache.get(key)
        }

        const result = processBlock(block, hashMap, stepKey)
        cache.set(key, result)

        return result
    }
}

function partOne() {
    // const { directions, hashMap } = parseInput("src/08/input.test.txt")
    // const { directions, hashMap } = parseInput("src/08/input.test2.txt")
    const { directions, hashMap } = parseInput("src/08/input.txt")

    const repeatingBlocks = breakDirections(directions)
    console.log(repeatingBlocks)

    let totalCount = 0
    let stepKey = [...hashMap.keys()][0]
    const memoized = memoProcessBlock()

    while (stepKey !== "ZZZ") {
        for (let i = 0; i < repeatingBlocks.length; i += 1) {
            console.log(stepKey)
            const { stepCount, lastStepKey } = memoized(
                repeatingBlocks[i],
                hashMap,
                stepKey
            )

            totalCount += stepCount
            stepKey = lastStepKey

            if (lastStepKey === "ZZZ") break
        }
    }
    console.log(stepKey)
    console.log(totalCount)
}

function partTwo() {}

console.log("DAY 8")
console.log(partOne())
// console.log(partTwo())
