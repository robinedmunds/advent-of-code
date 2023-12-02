// https://adventofcode.com/2020/day/3

import readInputFile from "../readFile"

type Position = {
  x: number
  y: number
}

const buildWorld = (input: string): string[][] => {
  return input.split("\n").map((line) => line.split(""))
}

const walk = (
  world: string[][],
  step: Position,
  current: Position,
  path: string[]
) => {
  const next: Position = {
    x: current.x + step.x,
    y: current.y + step.y
  }

  if (next.x > world[0].length - 1) {
    next.x = next.x - world[0].length
  }

  if (next.y >= world.length) return path

  path.push(world[next.y][next.x])

  // recurse
  walk(world, step, next, path)
}

const walkPath = (
  world: string[][],
  step: Position,
  start: Position
): string[] => {
  // returns 1 dimensional array of path chars
  const path: string[] = []

  walk(world, step, start, path)

  return path
}

const main = () => {
  const file = readInputFile("src/03/input.txt")
  if (!file) return

  const world = buildWorld(file)

  const start: Position = { x: 0, y: 0 }
  const step: Position = { x: 3, y: 1 }

  const path = walkPath(world, step, start)
  const treeCount = path.filter((i) => i === "#").length

  console.log("treeCount", treeCount)

  // part 2
  const SLOPES: Position[] = [
    { x: 1, y: 1 },
    { x: 3, y: 1 },
    { x: 5, y: 1 },
    { x: 7, y: 1 },
    { x: 1, y: 2 }
  ]

  const treesMultiplied = SLOPES.map(
    (step) => walkPath(world, step, start).filter((i) => i === "#").length
  ).reduce((prev, curr) => prev * curr)

  console.log("treesMultiplied", treesMultiplied)
}

export default main

