// https://adventofcode.com/2023/day/2

import readInputFile from "../readFile"

type RGB = { red: number; green: number; blue: number }

function processPick(pick: string): RGB {
    const rgb = { red: 0, green: 0, blue: 0 }
    const cubes = pick.split(", ").map((e) => e.split(" "))

    for (let i = 0; i < cubes.length; i += 1) {
        if (cubes[i][1] === "red") {
            rgb.red += +cubes[i][0]
        }

        if (cubes[i][1] === "green") {
            rgb.green += +cubes[i][0]
        }

        if (cubes[i][1] === "blue") {
            rgb.blue += +cubes[i][0]
        }
    }

    return rgb
}

function parseInput(path: string) {
    const file = readInputFile(path)
    if (!file) return []
    const lines = file.split("\r\n")
    const games = lines.map((e) => e.split(": ")[1].split("; "))

    const maxCubes: RGB[] = []
    for (let game = 0; game < games.length; game += 1) {
        const maxRGB = { red: 0, green: 0, blue: 0 }
        const picks = games[game]

        for (let pick = 0; pick < picks.length; pick += 1) {
            const processed = processPick(picks[pick])

            if (processed.red > maxRGB.red) {
                maxRGB.red = processed.red
            }

            if (processed.green > maxRGB.green) {
                maxRGB.green = processed.green
            }

            if (processed.blue > maxRGB.blue) {
                maxRGB.blue = processed.blue
            }
        }

        maxCubes.push(maxRGB)
    }

    return maxCubes
}

function partOne() {
    // const maxCubes = parseInput("src/02/input.test.txt")
    const maxCubes = parseInput("src/02/input.txt")

    const gameIds = []
    for (let game = 1; game <= maxCubes.length; game += 1) {
        if (
            maxCubes[game - 1].red <= 12 &&
            maxCubes[game - 1].green <= 13 &&
            maxCubes[game - 1].blue <= 14
        ) {
            gameIds.push(game)
        }
    }

    return gameIds.reduce((prev, curr) => prev + curr)
}

function partTwo() {
    // const maxCubes = parseInput("src/02/input.test.txt")
    const maxCubes = parseInput("src/02/input.txt")

    const powers = []
    for (let i = 0; i < maxCubes.length; i += 1) {
        powers.push(maxCubes[i].red * maxCubes[i].green * maxCubes[i].blue)
    }

    return powers.reduce((prev, curr) => prev + curr)
}

console.log("DAY 2")
console.log(partOne())
console.log(partTwo())
