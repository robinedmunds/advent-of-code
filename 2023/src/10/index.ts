// https://adventofcode.com/2023/day/10

import readInputFile from "../readFile"

// enum Heading {
//     Right,
//     Down,
//     Left,
//     Up,
// }
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

function walk(board: string[], path: Coords[], heading: Heading, curr: Coords) {
    // if next tile is NOT pipe, return null
    const nextCoord: Coords = {
        x: curr.x + direction[heading].x,
        y: curr.y + direction[heading].y,
    }
    // console.log(nextCoord)
    const nextTile = board[nextCoord.y][nextCoord.x]
    if (nextTile === ".") return "dead end"

    path.push(nextCoord)

    // base case
    if (nextTile === "S") {
        return path
    }

    if (nextTile === "-") {
        if (heading === "left") {
            walk(board, path, "left", nextCoord)
        }

        if (heading === "right") {
            walk(board, path, "right", nextCoord)
        }
    }

    if (nextTile === "7") {
        if (heading === "right") {
            walk(board, path, "down", nextCoord)
        }

        if (heading === "up") {
            walk(board, path, "left", nextCoord)
        }
    }

    if (nextTile === "|") {
        if (heading === "up") {
            walk(board, path, "up", nextCoord)
        }

        if (heading === "down") {
            walk(board, path, "down", nextCoord)
        }
    }

    if (nextTile === "J") {
        if (heading === "down") {
            walk(board, path, "left", nextCoord)
        }

        if (heading === "right") {
            walk(board, path, "up", nextCoord)
        }
    }

    if (nextTile === "L") {
        if (heading === "down") {
            walk(board, path, "right", nextCoord)
        }

        if (heading === "left") {
            walk(board, path, "up", nextCoord)
        }
    }

    if (nextTile === "F") {
        if (heading === "up") {
            walk(board, path, "right", nextCoord)
        }

        if (heading === "left") {
            walk(board, path, "down", nextCoord)
        }
    }
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

    // TODO: find start heading
    let heading: Heading = "up"
    if (["-", "F"].includes(input[start.y][start.x - 1])) {
        heading = "left"
    }
    if (["|", "L", "J"].includes(input[start.y + 1][start.x])) {
        heading = "down"
    }
    if (["-", "7"].includes(input[start.y][start.x + 1])) {
        heading = "right"
    }
    if (["|", "F", "7"].includes(input[start.y - 1][start.x])) {
        heading = "up"
    }

    const arr: Coords[] = [start]
    walk(input, arr, heading, arr[0])

    return arr.length / 2

    // const circuit: string[][] = []

    // for (let y = 0; y < input.length; y += 1) {
    //     const tmp = []
    //     for (let x = 0; x < input[0].length; x += 1) {
    //         tmp.push(".")
    //     }
    //     circuit.push(tmp)
    // }

    // for (const { x, y } of arr) {
    //     circuit[y][x] = "#"
    // }

    // for (const row of circuit) {
    //     console.log(row.join(""))
    // }
}

function partTwo(input: string[]) {}

const inputTest = parseInput("src/10/input.test.txt")
const input = parseInput("src/10/input.txt")

console.log("DAY 10")
console.log(partOne(inputTest))
console.log(partOne(input))
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
