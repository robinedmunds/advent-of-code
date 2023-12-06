// https://adventofcode.com/2023/day/6

import readInputFile from "../readFile"

type RaceResult = { time: number; distance: number }

function parseInput(path: string) {
    const file = readInputFile(path)
    if (!file) return

    const grid = file.split("\r\n").map((line) =>
        line
            .split(" ")
            .filter((s) => s !== "" && !s.includes(":"))
            .map((s) => +s)
    )

    const output: RaceResult[] = []
    for (let i = 0; i < grid[0].length; i += 1) {
        output.push({ time: grid[0][i], distance: grid[1][i] })
    }

    return output
}

function calcRaceDistance(hold: number, time: number): number {
    if (hold >= time) return 0

    const timeInMotion = time - hold
    const distance = hold * timeInMotion

    return distance
}

function partOne() {
    // const raceRecords = parseInput("src/06/input.test.txt")
    const raceRecords = parseInput("src/06/input.txt")
    if (!raceRecords) throw "Parsing error"

    const marginsOfError = []
    for (const record of raceRecords) {
        let hold = 1
        let distance = calcRaceDistance(hold, record.time)

        const results = []
        while (distance > 0) {
            if (distance > record.distance) {
                results.push({ hold, distance })
            }

            hold += 1
            distance = calcRaceDistance(hold, record.time)
        }

        marginsOfError.push(results.length)
    }

    return marginsOfError.reduce((prev, curr) => prev * curr)
}

function partTwo() {
    // const raceRecords = parseInput("src/06/input.test.txt")
    const raceRecords = parseInput("src/06/input.txt")
    if (!raceRecords) throw "Parsing error"

    const record: RaceResult = {
        time: +raceRecords.map((o) => o.time).join(""),
        distance: +raceRecords.map((o) => o.distance).join(""),
    }

    let hold = 1
    let distance = calcRaceDistance(hold, record.time)

    const results = []
    while (distance > 0) {
        if (distance > record.distance) {
            results.push({ hold, distance })
        }

        hold += 1
        distance = calcRaceDistance(hold, record.time)
    }

    return results.length
}

console.log("DAY 6")
console.log(partOne())
console.log(partTwo())
