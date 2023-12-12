// https://adventofcode.com/2023/day/11

import readInputFile from "../readFile"

type Coords = { x: number; y: number }

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
    const inflated = translateACW(rotated)

    const galax: Coords[] = []
    for (let y = 0; y < inflated.length; y += 1) {
        for (let x = 0; x < inflated[0].length; x += 1) {
            if (inflated[y][x] === "#") {
                galax.push({ x, y })
            }
        }
    }

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

    return distances.reduce((prev, curr) => prev + curr)
}

function mapExpansion(input: string[]) {
    const expansion: { x: number[]; y: number[] } = { x: [], y: [] }

    for (let y = 0; y < input.length; y += 1) {
        if (input[y].split("").every((s) => s === ".")) {
            expansion.y.push(y)
        }
    }

    const rotated = translateCW(input)
    for (let y = 0; y < rotated.length; y += 1) {
        if (rotated[y].split("").every((s) => s === ".")) {
            expansion.x.push(y)
        }
    }

    return expansion
}

function partTwo(input: string[]) {
    const galax: Coords[] = []
    for (let y = 0; y < input.length; y += 1) {
        for (let x = 0; x < input[0].length; x += 1) {
            if (input[y][x] === "#") {
                galax.push({ x, y })
            }
        }
    }

    const inflation = mapExpansion(input)

    const seen: string[] = []
    const distances: number[] = [] // manhattan
    for (let i = 0; i < galax.length; i += 1) {
        for (let j = 0; j < galax.length; j += 1) {
            if (i === j) continue
            if (seen.includes(`${Math.min(i, j)}_${Math.max(i, j)}`)) continue

            const minY = Math.min(galax[i].y, galax[j].y)
            const maxY = Math.max(galax[i].y, galax[j].y)
            const yInflationMultiplier = inflation.y.filter(
                (y) => y > minY && y < maxY
            ).length

            const minX = Math.min(galax[i].x, galax[j].x)
            const maxX = Math.max(galax[i].x, galax[j].x)
            const xInflationMultiplier = inflation.x.filter(
                (x) => x > minX && x < maxX
            ).length

            distances.push(
                maxY -
                    minY +
                    maxX -
                    minX +
                    (yInflationMultiplier + xInflationMultiplier) *
                        (10 ** 6 - 1)
            )

            seen.push(`${Math.min(i, j)}_${Math.max(i, j)}`)
        }
    }

    return distances.reduce((prev, curr) => prev + curr)
}

// const input = parseInput("src/11/input.test.txt")
const input = parseInput("src/11/input.txt")
console.log("DAY 11")
console.log(partOne(input))
console.log(partTwo(input))
