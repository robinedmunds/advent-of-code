// https://adventofcode.com/2023/day/10

import readInputFile from "../readFile"

type Coords = { x: number; y: number }
const direction = {
    up: { x: 0, y: -1 } as Coords,
    down: { x: 0, y: 1 } as Coords,
    right: { x: 1, y: 0 } as Coords,
    left: { x: -1, y: 0 } as Coords,
} as const

type Heading = keyof typeof direction

function parseInput(path: string): string[] {
    const file = readInputFile(path)
    if (!file) return []

    return file.split("\r\n")
}

function printBoard(board: string[]): void {
    console.log()
    for (const line of board) {
        console.log(line)
    }
    console.log()
}

function walk(
    board: string[],
    path: Coords[],
    heading: Heading,
    curr: Coords
): { heading: Heading; nextCoord: Coords } {
    const nextCoord: Coords = {
        x: curr.x + direction[heading].x,
        y: curr.y + direction[heading].y,
    }
    const nextTile = board[nextCoord.y][nextCoord.x]
    if (nextTile === ".") throw "Dead end!!"
    if (nextTile === "S") return { heading, nextCoord }
    path.push(nextCoord)

    if (nextTile === "-") {
        return { heading, nextCoord }
    }

    if (nextTile === "7") {
        if (heading === "right") {
            return { heading: "down", nextCoord }
        }

        if (heading === "up") {
            return { heading: "left", nextCoord }
        }
    }

    if (nextTile === "|") {
        return { heading, nextCoord }
    }

    if (nextTile === "J") {
        if (heading === "down") {
            return { heading: "left", nextCoord }
        }

        if (heading === "right") {
            return { heading: "up", nextCoord }
        }
    }

    if (nextTile === "L") {
        if (heading === "down") {
            return { heading: "right", nextCoord }
        }

        if (heading === "left") {
            return { heading: "up", nextCoord }
        }
    }

    if (nextTile === "F") {
        if (heading === "up") {
            return { heading: "right", nextCoord }
        }

        if (heading === "left") {
            return { heading: "down", nextCoord }
        }
    }

    throw "Walk: This should never happen!"
}

function partOne(input: string[]) {
    const start: Coords = { x: -1, y: -1 }
    for (let y = 0; y < input.length; y += 1) {
        if (!input[y].includes("S")) continue
        start.y = y
        start.x = input[y].indexOf("S")
        break
    }

    // printBoard(input)
    // console.log(start)

    let heading: Heading = "up"
    if (start.x > 0) {
        if (["-", "F"].includes(input[start.y][start.x - 1])) {
            heading = "left"
        }
    }
    if (start.y < input.length - 1) {
        if (["|", "L", "J"].includes(input[start.y + 1][start.x])) {
            heading = "down"
        }
    }
    if (start.x < input[0].length - 1) {
        if (["-", "7"].includes(input[start.y][start.x + 1])) {
            heading = "right"
        }
    }
    if (start.y > 0) {
        if (["|", "F", "7"].includes(input[start.y - 1][start.x])) {
            heading = "up"
        }
    }

    const path: Coords[] = [start]
    let next = walk(input, path, heading, path[0])
    while (true) {
        next = walk(input, path, next.heading, next.nextCoord)

        if (input[next.nextCoord.y][next.nextCoord.x] === "S") {
            break
        }
    }

    const circuit: string[][] = []

    for (let y = 0; y < input.length; y += 1) {
        const tmp = []
        for (let x = 0; x < input[0].length; x += 1) {
            tmp.push(".")
        }
        circuit.push(tmp)
    }

    for (const { x, y } of path) {
        circuit[y][x] = "#"
    }

    for (const row of circuit) {
        console.log(row.join(""))
    }

    return path.length / 2
}

function partTwo(input: string[]) {}

const inputTest = parseInput("src/10/input.test3.txt")
// const input = parseInput("src/10/input.txt")

console.log("DAY 10")
console.log(partOne(inputTest))
// console.log(partOne(input))
// console.log(partTwo(hands))

// -L|F7
// 7S-7|
// L|7||
// -L-J|
// L|-JF

// .....
// .F-7.
// .|.|.
// .L-J.
// .....

// .....
// .012.
// .1.3.
// .234.
// .....
