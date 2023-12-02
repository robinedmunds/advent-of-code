// https://adventofcode.com/2022/day/8

import readInputFile from "../readFile"

const parseInput = (file: string) => {
  return file
    .split("\n")
    .map((line) => line.split("").map((str) => parseInt(str)))
}

const partOne = (forest: number[][]) => {
  // how many trees are visible from outside the grid?
  const visible: boolean[][] = []

  for (let i = 0; i < forest.length; ++i) {
    visible.push(new Array(forest[0].length).fill(false))
  }

  // left to right
  for (let y = 0; y < forest.length; ++y) {
    let largest = 0

    for (let x = 0; x < forest[0].length; ++x) {
      if (x === 0) {
        visible[y][x] = true
        largest = forest[y][x]
        continue
      }

      const tree = forest[y][x]

      if (tree > largest) {
        visible[y][x] = true
        largest = tree
      }
    }
  }

  // right to left
  for (let y = 0; y < forest.length; ++y) {
    let largest = 0

    for (let x = forest[0].length - 1; x >= 0; --x) {
      if (x === forest[0].length - 1) {
        visible[y][x] = true
        largest = forest[y][x]
        continue
      }

      const tree = forest[y][x]

      if (tree > largest) {
        visible[y][x] = true
        largest = tree
      }
    }
  }

  // top to bottom
  for (let x = 0; x < forest[0].length; ++x) {
    let largest = 0

    for (let y = 0; y < forest.length; ++y) {
      if (y === 0) {
        visible[y][x] = true
        largest = forest[y][x]
        continue
      }

      const tree = forest[y][x]

      if (tree > largest) {
        visible[y][x] = true
        largest = tree
      }
    }
  }

  // bottom to top
  for (let x = 0; x < forest[0].length; ++x) {
    let largest = 0

    for (let y = forest.length - 1; y >= 0; --y) {
      if (y === forest.length - 1) {
        visible[y][x] = true
        largest = forest[y][x]
        continue
      }

      const tree = forest[y][x]

      if (tree > largest) {
        visible[y][x] = true
        largest = tree
      }
    }
  }

  const visibleCount = visible
    .slice()
    .flat()
    .filter((i) => i === true).length

  console.log("partOne:", visibleCount)

  return visible
}

const treesVisibleFromThisTree = (forest: number[][], coords: number[]) => {
  const staticY = coords[0]
  const staticX = coords[1]
  const visibleCountsMap = new Map()
  const anchorTree = forest[staticY][staticX]
  visibleCountsMap.set("toTop", 0)
  visibleCountsMap.set("toLeft", 0)
  visibleCountsMap.set("toRight", 0)
  visibleCountsMap.set("toBottom", 0)

  // trees to right
  for (let x = staticX + 1; x < forest[0].length; ++x) {
    const currTree = forest[staticY][x]
    visibleCountsMap.set("toRight", visibleCountsMap.get("toRight") + 1)

    if (currTree >= anchorTree) {
      break
    }
  }

  // trees to left
  for (let x = staticX - 1; x >= 0; --x) {
    const currTree = forest[staticY][x]
    visibleCountsMap.set("toLeft", visibleCountsMap.get("toLeft") + 1)

    if (currTree >= anchorTree) {
      break
    }
  }

  // trees to bottom
  for (let y = staticY + 1; y < forest.length; ++y) {
    const currTree = forest[y][staticX]
    visibleCountsMap.set("toBottom", visibleCountsMap.get("toBottom") + 1)

    if (currTree >= anchorTree) {
      break
    }
  }

  // trees to top
  for (let y = staticY - 1; y >= 0; --y) {
    const currTree = forest[y][staticX]
    visibleCountsMap.set("toTop", visibleCountsMap.get("toTop") + 1)

    if (currTree >= anchorTree) {
      break
    }
  }

  return [...visibleCountsMap.values()].reduce((prev, curr) => prev * curr)
}

const partTwo = (forest: number[][]) => {
  // What is the highest scenic score possible for any tree?
  const scenicScores = []

  for (let y = 0; y < forest.length; ++y) {
    for (let x = 0; x < forest[0].length; ++x) {
      scenicScores.push(treesVisibleFromThisTree(forest, [y, x]))
    }
  }

  const bestScenicScore = scenicScores.sort((a, b) => b - a)[0]
  console.log("partTwo:", bestScenicScore)
}

const main = () => {
  const file = readInputFile("src/08/input.txt")
  if (!file) return
  const parsed = parseInput(file)

  partOne(parsed)
  partTwo(parsed)
}

export default main
