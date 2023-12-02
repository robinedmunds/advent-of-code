// https://adventofcode.com/2020/day/5

import readInputFile from "../readFile"

const ROWS = 128
const COLUMNS = 8

enum Instructions {
  RowLowerHalf = "F",
  RowUpperHalf = "B",
  ColumnLowerHalf = "L",
  ColumnUpperHalf = "R"
}

const buildSeatRow = (start: number, end: number) => {
  const row: number[] = []

  for (let i = start; i < end; ++i) {
    row.push(i)
  }

  return row
}

const buildSeatGrid = () => {
  const seatGrid: number[][] = []

  for (let i = 0; i < ROWS; ++i) {
    seatGrid.push(buildSeatRow(i * COLUMNS, i * COLUMNS + COLUMNS))
  }

  return seatGrid
}

const binarySearch = (
  grid: number[][],
  instructions: string,
  instructionIdx: number
): number[][] | null => {
  if (!instructions[instructionIdx]) return grid

  switch (instructions[instructionIdx]) {
    case Instructions.RowLowerHalf:
      grid.splice(Math.floor(grid.length / 2), grid.length)

      return binarySearch(grid, instructions, instructionIdx + 1)
    case Instructions.RowUpperHalf:
      grid.splice(0, Math.floor(grid.length / 2))

      return binarySearch(grid, instructions, instructionIdx + 1)
    case Instructions.ColumnLowerHalf:
      for (const row of grid) {
        row.splice(Math.floor(grid[0].length / 2))
      }

      return binarySearch(grid, instructions, instructionIdx + 1)
    case Instructions.ColumnUpperHalf:
      for (const row of grid) {
        row.splice(0, Math.floor(grid[0].length / 2))
      }

      return binarySearch(grid, instructions, instructionIdx + 1)
  }

  console.error("binarySearch: execution left switch statement")
  return null
}

const main = () => {
  const file = readInputFile("src/05/input.txt")
  if (!file) return

  const boardingPasses = file.split("\n")
  const occupiedSeats: number[] = []

  for (const pass of boardingPasses) {
    const seatGrid = buildSeatGrid()

    const seatId = binarySearch(seatGrid, pass, 0)?.flat()

    if (seatId && seatId[0]) {
      occupiedSeats.push(seatId[0])
    }
  }

  console.log("occupiedSeats", occupiedSeats.length, "/", COLUMNS * ROWS)
  console.log("\nhighest id", occupiedSeats.sort((a, b) => b - a)[0])

  // part 2

  const occupied = new Array(ROWS * COLUMNS).fill(false)
  for (const id of occupiedSeats) {
    occupied[id] = true
  }

  for (let seatId = 1; seatId < occupied.length - 1; ++seatId) {
    if (
      occupied[seatId] === false &&
      occupied[seatId - 1] === true &&
      occupied[seatId + 1] === true
    ) {
      console.log("\nmy seatId:", seatId)
    }
  }
}

export default main
