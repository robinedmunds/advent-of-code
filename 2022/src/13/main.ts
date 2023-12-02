// https://adventofcode.com/2022/day/13

import readInputFile from "../readFile"
import ParseTree from "./ParseTree"
import type { DeepNumbers } from "./ParseTree"

type Pair = {
  left: DeepNumbers
  right: DeepNumbers
}

const parseLines = (str: string) => {
  const strPairs = str.split("\n\n").map((pair) => pair.split("\n"))

  const pairs: Pair[] = []
  for (const [left, right] of strPairs) {
    pairs.push({
      left: new ParseTree(left).parsed,
      right: new ParseTree(right).parsed
    })
  }

  return pairs
}

const partOne = (file: string) => {
  const parsedPairs: Pair[] = parseLines(file)

  const validatedIndexes: Set<number> = new Set()
  for (let pairIdx = 1; pairIdx <= parsedPairs.length; ++pairIdx) {
    const { left, right } = parsedPairs[pairIdx - 1]

    if (Array.isArray(left) && Array.isArray(right)) {
      // console.log("left.flat(1).length", left.flat(1).length)
      // console.log("right.flat(1).length", right.flat(1).length)
      console.log("left", left)
      console.log("right", right)
      console.log()

      if (left.flat(1).length > right.flat(1).length) {
        continue
      } else if (left.flat(1).length < right.flat(1).length) {
        validatedIndexes.add(pairIdx)

        continue
      }

      const leftFlat = left.flat(9)
      const rightFlat = right.flat(9)

      if (leftFlat.length < 1 || rightFlat.length < 1) {
        break
      }

      const validated = []
      for (let idx = 0; idx < leftFlat.length; idx++) {
        const l = leftFlat[idx]
        const r = rightFlat[idx]

        if (l < r) {
          validatedIndexes.add(pairIdx)

          break
        } else {
          validated.push(l <= r)
        }
      }

      if ([...validated].every((bool) => bool === true) === true) {
        validatedIndexes.add(pairIdx)
      }
    }
  }

  // console.log()
  // console.log(validatedIndexes)

  // console.log()
  console.log(
    "partOne:",
    [...validatedIndexes].reduce((prev: number, curr: number) => prev + curr)
  )
}

const main = () => {
  // const file = readInputFile("src/13/input.txt")
  const file = readInputFile("src/13/input_test.txt")
  if (!file) return

  partOne(file)
}

export default main
