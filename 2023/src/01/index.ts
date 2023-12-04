// https://adventofcode.com/2023/day/1

import readInputFile from "../readFile"

function parseInput(path: string): string[][] {
    const file = readInputFile(path)
    if (!file) return [[]]

    return file.split("\r\n").map((w) => w.split(""))
}

function partOne() {
    const input = parseInput("src/01/input.txt")
    const digits = "0123456789".split("")
    const filtered = input.map((arr) =>
        arr.filter((elem) => digits.includes(elem))
    )
    const numbers = filtered.map(
        (elem) => +elem[0].concat(elem[elem.length - 1])
    )

    return numbers.reduce((prev, curr) => prev + curr)
}

function buildHashMap() {
    const hm: Map<string, number> = new Map()
    const verbose = [
        "one",
        "two",
        "three",
        "four",
        "five",
        "six",
        "seven",
        "eight",
        "nine",
    ]

    for (let idx = 1; idx <= verbose.length; idx += 1) {
        hm.set(`${idx}`, idx)
        hm.set(verbose[idx - 1], idx)
    }

    return hm
}

function partTwo() {
    const file = readInputFile("src/01/input.txt")
    if (!file) return

    const lines = file.split("\r\n")
    const hm = buildHashMap()
    const maxKeyLength = Math.max(...[...hm.keys()].map((k) => k.length))

    const processed = []
    for (const word of lines) {
        const values: number[] = []

        for (let start = 0; start < word.length; start += 1) {
            for (let end = 1; end <= word.length; end += 1) {
                if (end - start > maxKeyLength) {
                    break
                }

                if (hm.has(word.slice(start, end)) === false) {
                    continue
                }

                const int = hm.get(word.slice(start, end))
                if (!int) throw "Hashmap return undefined"
                values.push(int)
            }
        }

        processed.push(values)
    }

    const numbers = processed.map(
        (elem) => elem[0] * 10 + elem[elem.length - 1]
    )

    return numbers.reduce((prev, curr) => prev + curr)
}

console.log("DAY 1")
console.log(partOne())
console.log(partTwo())
