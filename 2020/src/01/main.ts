// https://adventofcode.com/2020/day/1

import readInputFile from "../readFile"

const findIndexes = (arr: number[], sum: number): number[] => {
  for (let idxA = 0; idxA < arr.length; ++idxA) {
    for (let idxB = idxA + 1; idxB < arr.length; ++idxB) {
      if (!arr[idxB]) break

      if (arr[idxA] + arr[idxB] === sum) {
        return [idxA, idxB]
      }
    }
  }

  return [-1, -1]
}

const findThreeIndexes = (arr: number[], sum: number): number[] => {
  for (let idxA = 0; idxA < arr.length; ++idxA) {
    for (let idxB = idxA + 1; idxB < arr.length; ++idxB) {
      for (let idxC = idxB + 1; idxC < arr.length; ++idxC) {
        if (!arr[idxB] || !arr[idxC]) break

        if (arr[idxA] + arr[idxB] + arr[idxC] === sum) {
          return [idxA, idxB, idxC]
        }
      }
    }
  }

  return [-1, -1, -1]
}

const findAndMultiplyEntries = (input: number[], sum: number): number => {
  const [a, b] = findIndexes(input, 2020)

  return input[a] * input[b]
}

const findAndMultiplyThreeEntries = (input: number[], sum: number): number => {
  const [a, b, c] = findThreeIndexes(input, 2020)

  return input[a] * input[b] * input[c]
}

const main = () => {
  const file = readInputFile("src/01/input.txt")
  if (!file) return

  const input: number[] = file.split("\n").map((a) => parseInt(a))

  console.log(findAndMultiplyEntries([1721, 979, 366, 299, 675, 1456], 2020))
  console.log(findAndMultiplyEntries(input, 2020))
  console.log(findAndMultiplyThreeEntries(input, 2020))
}

export default main

