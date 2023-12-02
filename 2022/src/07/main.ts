// https://adventofcode.com/2022/day/7

import readInputFile from "../readFile"
import FileSystemRoot from "./FileSystemRoot"

const parseInput = (file: string) => {
  return file.split("\n").map((line) => line.split(" "))
}

const runCommands = (input: string[][], fs: FileSystemRoot) => {
  for (const line of input) {
    if (line[0] === "$") {
      if (line[1] === "cd") {
        fs.changeDirectory(line[2])
        // console.log("cd to", line[2])
      }

      if (line[1] === "ls") {
        fs.listContents()
        // console.log("list current directory")
      }
    }

    if (line[0] === "dir") {
      fs.createDirectoryHere(line[1])
      // console.log("create new directory", line[1])
    }

    if (!isNaN(parseInt(line[0]))) {
      fs.createFileHere(line[1], parseInt(line[0]))
      // console.log("create new file", line[1], "with size", line[0])
    }
  }
}

const partOne = (file: string) => {
  const parsed = parseInput(file)
  const fs = new FileSystemRoot()
  runCommands(parsed, fs)

  const dirSizeMap = fs.getAllDirectoriesSizes()

  const filtered = new Map()
  for (const [k, v] of dirSizeMap.entries()) {
    if (v <= 100_000) filtered.set(k, v)
  }

  console.log(
    "partOne:",
    [...filtered.values()].reduce((prev, curr) => prev + curr)
  )
}

const partTwo = (file: string) => {
  const DISK_SIZE = 70_000_000
  const REQUIRED_FREE_SPACE = 30_000_000
  const parsed = parseInput(file)
  const fs = new FileSystemRoot()
  runCommands(parsed, fs)

  const dirSizeMap = fs.getAllDirectoriesSizes()
  const spaceUsed = dirSizeMap.get("/")

  const ordered = []
  for (const [k, v] of dirSizeMap.entries()) {
    ordered.push([v, k])
  }
  ordered.sort((a, b) => {
    if (typeof a[0] === "number" && typeof b[0] === "number") {
      return a[0] - b[0]
    }

    return 0
  })

  if (!spaceUsed) return console.error("spaceUsed undefined")

  const currentFreeSpace = DISK_SIZE - spaceUsed
  const spaceToFree = REQUIRED_FREE_SPACE - currentFreeSpace

  const viableDirs = []
  for (let i = 0; i < ordered.length; ++i) {
    if (ordered[i][0] >= spaceToFree) {
      viableDirs.push(ordered[i])
    }
  }

  console.log("partTwo:", viableDirs[0])
}

const main = () => {
  const file = readInputFile("src/07/input.txt")
  if (!file) return

  partOne(file)
  partTwo(file)
}

export default main
