// https://adventofcode.com/2022/day/4

import readInputFile from "../readFile"

const parseLines = (lines: string[]) => {
  const parsed = []

  for (const line of lines) {
    const tmp = []
    const pair = line.split(",")

    for (const elf of pair) {
      const range = elf.split("-")
      tmp.push(range.map((i) => parseInt(i)))
    }

    parsed.push(tmp)
  }

  return parsed
}

const biggerRangeContainsSmallerRange = (pair: number[][]) => {
  let larger: number[] | null = null
  let smaller: number[] | null = null

  if (pair[0][1] - pair[0][0] > pair[1][1] - pair[1][0]) {
    larger = pair[0]
    smaller = pair[1]
  } else {
    larger = pair[1]
    smaller = pair[0]
  }

  if (smaller[0] >= larger[0] && smaller[1] <= larger[1]) {
    return true
  }

  return false
}

const rangesOverlap = (pair: number[][]) => {
  const maxA = Math.max(...pair[0])
  const minA = Math.min(...pair[0])
  const maxB = Math.max(...pair[1])
  const minB = Math.min(...pair[1])

  if (maxA >= minB && minB >= minA) {
    return true
  }

  if (maxB >= minA && minA >= minB) {
    return true
  }

  return false
}

const main = () => {
  const file = readInputFile("src/04/input.txt")
  if (!file) return

  const lines = file.split("\n")

  const biggerRangeContainsSmallerRangeArr = []
  const rangesOverlapArr = []

  for (const pair of parseLines(lines)) {
    biggerRangeContainsSmallerRangeArr.push(
      biggerRangeContainsSmallerRange(pair)
    )

    // part 2

    rangesOverlapArr.push(rangesOverlap(pair))
  }

  const totallyCoveredCount = biggerRangeContainsSmallerRangeArr.filter(
    (i) => i === true
  ).length

  const overlappingRangesCount = rangesOverlapArr.filter(
    (i) => i === true
  ).length

  console.log("totallyCoveredCount", totallyCoveredCount)
  console.log("overlappingRangesCount", overlappingRangesCount)
}

export default main
