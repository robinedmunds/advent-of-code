// https://adventofcode.com/2023/day/11

import readInputFile from "../readFile"

function parseInput(path: string): string[] {
    const file = readInputFile(path)
    if (!file) throw "Invalid file path."

    return file.split("\r\n")
}

function printBoard(board: string[]): void {
    console.log()
    for (const line of board) {
        console.log(line)
    }
    console.log()
}

function translateCW(input: string[]) {
    const out = []
    for (let x = 0; x < input[0].length; x += 1) {
        const col = []
        for (let y = input.length - 1; y >= 0; y -= 1) {
            col.push(input[y][x])
        }

        out.push(col.join(""))
    }

    return out
}

function translateACW(input: string[]) {
    const out = []
    for (let x = input[0].length - 1; x >= 0; x -= 1) {
        const col = []
        for (let y = 0; y < input.length; y += 1) {
            col.push(input[y][x])
        }

        out.push(col.join(""))
    }

    return out
}

type Coords = { x: number; y: number }

function partOne(input: string[]) {
    const inflatedY = input.slice()
    for (let y = 0; y < inflatedY.length; y += 1) {
        if (inflatedY[y].split("").every((s) => s === ".")) {
            inflatedY.splice(y, 0, inflatedY[y])
            y += 1
        }
    }
    const rotated = translateCW(inflatedY)
    for (let y = 0; y < rotated.length; y += 1) {
        if (rotated[y].split("").every((s) => s === ".")) {
            rotated.splice(y, 0, rotated[y])
            y += 1
        }
    }
    // const inflated = translateACW(rotated).filter((row) => row !== "")
    const inflated = translateACW(rotated)

    // printBoard(inflated)
    // console.log(inflated)

    const galax: Coords[] = []
    for (let y = 0; y < inflated.length; y += 1) {
        for (let x = 0; x < inflated[0].length; x += 1) {
            if (inflated[y][x] === "#") {
                galax.push({ x, y })
            }
        }
    }

    // console.log(galax)
    const seen: string[] = []
    const distances: number[] = [] // manhattan
    for (let i = 0; i < galax.length; i += 1) {
        for (let j = 0; j < galax.length; j += 1) {
            if (i === j) continue
            if (seen.includes(`${Math.min(i, j)}_${Math.max(i, j)}`)) continue

            distances.push(
                Math.abs(galax[i].x - galax[j].x) +
                    Math.abs(galax[i].y - galax[j].y)
            )

            seen.push(`${Math.min(i, j)}_${Math.max(i, j)}`)
        }
    }

    // console.log(distances)
    // console.log(distances.length)
    // console.log()

    return distances.reduce((prev, curr) => prev + curr)
}

function partTwo(input: string[]) {}

const inputT = parseInput("src/11/input.test.txt")
const input = parseInput("src/11/input.txt")
console.log("DAY 11")
console.log(partOne(inputT))
console.log(partOne(input))
// console.log(partTwo(input))
