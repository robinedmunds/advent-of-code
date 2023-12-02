// https://adventofcode.com/2020/day/6

import readInputFile from "../readFile"

const partOne = (groups: string[][][]): number => {
  const groupsCount: number[] = []

  for (const group of groups) {
    const groupCount: string[] = []

    for (const person of group) {
      for (const yes of person) {
        if (!groupCount.includes(yes)) {
          groupCount.push(yes)
        }
      }
    }

    groupsCount.push(groupCount.length)
  }

  return groupsCount.reduce((running, curr) => running + curr)
}

const partTwo = (groups: string[][][]): number => {
  let unanimousCount = 0

  for (const group of groups) {
    const groupHashMap = new Map()

    for (const person of group) {
      for (const yes of person) {
        if (groupHashMap.has(yes)) {
          groupHashMap.set(yes, groupHashMap.get(yes) + 1)
        } else {
          groupHashMap.set(yes, 1)
        }
      }
    }

    for (const yesCount of groupHashMap.values()) {
      if (yesCount === group.length) {
        unanimousCount++
      }
    }
  }

  return unanimousCount
}

const main = () => {
  const file = readInputFile("src/06/input.txt")
  if (!file) return

  const groups = file
    .split("\n\n")
    .map((g) => g.split("\n").map((a) => a.split("")))

  const partOneOutput = partOne(groups)
  console.log("partOneOutput", partOneOutput)

  const partTwoOutput = partTwo(groups)
  console.log("partTwoOutput", partTwoOutput)
}

export default main

