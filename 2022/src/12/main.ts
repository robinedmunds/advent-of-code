// https://adventofcode.com/2022/day/12

import readInputFile from "../readFile"
import AdjacencyList from "./AdjacencyList"

const partTwo = (al: AdjacencyList) => {
  al.partTwo()

  const pathLengths = []
  for (const path of al.partTwoPaths) {
    pathLengths.push(path.length - 1)
  }

  const sortedAsc = pathLengths.sort((a, b) => a - b)
  console.log("partTwo:", sortedAsc[0])
}

const main = () => {
  const file = readInputFile("src/12/input.txt")
  if (!file) return

  const al = new AdjacencyList(file)
  const map = al.strGrid.slice()

  for (const row of map) {
    console.log(row.join(""))
  }

  console.log()

  for (const { x, y } of al.shortestPath) {
    // map[y][x] = " "
    map[y][x] = map[y][x].toUpperCase()
    map[al.start.y][al.start.x] = "S"
    map[al.end.y][al.end.x] = "E"
  }

  for (const row of map) {
    console.log(row.join(""))
  }

  console.log()
  console.log("partOne:", al.shortestPath.length - 1)

  partTwo(al)
}

export default main

