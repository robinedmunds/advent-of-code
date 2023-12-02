// https://adventofcode.com/2020/day/9

import readInputFile from "../readFile"

const parseInput = (file: string) => {
  return file.split("\n").map((str) => parseInt(str))
}

const calcAllValidSums = (preamble: number[]) => {
  const results: Set<number> = new Set()

  for (let i = 0; i < preamble.length; ++i) {
    for (let j = 0; j < preamble.length; ++j) {
      if (i === j) continue
      results.add(preamble[i] + preamble[j])
    }
  }

  return [...results]
}

const partOne = (data: number[], preambleLength: number) => {
  const resultsMap = new Map()

  for (let i = preambleLength; i < data.length; ++i) {
    const preamble = data.slice(i - preambleLength, i)
    const unit = data[i]

    resultsMap.set(unit, calcAllValidSums(preamble).includes(unit))
  }

  for (const [k, v] of resultsMap.entries()) {
    if (v === false) {
      console.log("partOne:", k)

      return k
    }
  }
}

const findSmallestLargestElemsCalcSum = (range: number[]) => {
  const sortedAsc = range.slice().sort((a, b) => a - b)
  const smallest = sortedAsc[0]
  const largest = sortedAsc[sortedAsc.length - 1]

  return smallest + largest
}

const partTwo = (data: number[], invalidUnit: number) => {
  for (let start = 0; start < data.length; ++start) {
    for (let end = start + 2; end < data.length; ++end) {
      const range = data.slice(start, end)
      const sum = range.reduce((prev, curr) => prev + curr)

      if (sum === invalidUnit) {
        return console.log("partTwo:", findSmallestLargestElemsCalcSum(range))
      }
    }
  }
}

const main = () => {
  const file = readInputFile("src/09/input.txt")
  if (!file) return
  const parsed = parseInput(file)

  const invalidUnit = partOne(parsed, 25)
  partTwo(parsed, invalidUnit)
}

export default main

