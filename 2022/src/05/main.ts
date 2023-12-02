// https://adventofcode.com/2022/day/5

import readInputFile from "../readFile"
import parseStacks from "./parseStacks"
import Stack from "./Stack"
import parseMoves from "./parseMoves"
import type { Move } from "./parseMoves"

const buildStackHashMap = (parsedStacks: string[]) => {
  const stackHashMap = new Map()
  for (const parsedStack of parsedStacks) {
    const id = parsedStack[0]
    const items = parsedStack.slice(1).split("")

    const newStack = new Stack()
    for (const item of items) {
      newStack.push(item)
    }

    stackHashMap.set(parseInt(id), newStack)
  }

  return stackHashMap
}

const processMoves = (
  stackHashMap: Map<number, Stack<string>>,
  moves: Move[]
): void => {
  for (const move of moves) {
    const fromStack = stackHashMap.get(move.fromLocation)
    const toStack = stackHashMap.get(move.toLocation)

    if (!fromStack || !toStack) {
      return console.error(
        "Error: One of the stacks not found in stackHashMap."
      )
    }

    for (let i = 0; i < move.quantity; ++i) {
      const moving = fromStack.pop()
      if (!moving) break

      toStack.push(moving)
    }
  }
}

const processMovesTwo = (
  stackHashMap: Map<number, Stack<string>>,
  moves: Move[]
): void => {
  for (const move of moves) {
    const fromStack = stackHashMap.get(move.fromLocation)
    const toStack = stackHashMap.get(move.toLocation)

    if (!fromStack || !toStack) {
      return console.error(
        "Error: One of the stacks not found in stackHashMap."
      )
    }

    const cratesInAir = []

    for (let i = 0; i < move.quantity; ++i) {
      const moving = fromStack.pop()
      if (!moving) break

      cratesInAir.push(moving)
    }

    for (const crate of cratesInAir.reverse()) {
      toStack.push(crate)
    }
  }
}

const main = () => {
  const file = readInputFile("src/05/input.txt")
  if (!file) return

  const parsedStacks = parseStacks(file)
  const stackHashMap = buildStackHashMap(parsedStacks)
  const parsedMoves = parseMoves(file)

  processMovesTwo(stackHashMap, parsedMoves)

  const output = []
  for (const stack of stackHashMap.values()) {
    output.push(stack.peek())
  }

  console.log(output.join(""))
}

export default main
