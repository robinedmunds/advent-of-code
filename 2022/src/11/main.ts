// https://adventofcode.com/2022/day/11

import readInputFile from "../readFile"
import parseInput from "./parseInput"
import type { Monkey, Test, Operation } from "./parseInput"

const monkeyInspectsItem = (operation: Operation, worryLevel: bigint) => {
  const a = operation.a === "old" ? worryLevel : BigInt(operation.a)
  const b = operation.b === "old" ? worryLevel : BigInt(operation.b)

  switch (operation.operator) {
    case "+":
      return a + b
    case "-":
      return a - b
    case "*":
      return a * b
    case "/":
      return a / b
  }

  console.error("Error: no appropriate inspection worry operation found.")

  return worryLevel
}

const itemMeetsInspectionTest = (test: Test, worryLevel: bigint): boolean => {
  switch (test.test) {
    case "divisible":
      return worryLevel % BigInt(test.value) === BigInt(0)
  }

  console.error("Error: no appropriate inspection test found.")

  return false
}

const processRound = (monkeys: Monkey[], magicDivisor?: number) => {
  for (let monkeyId = 0; monkeyId < monkeys.length; monkeyId++) {
    const monkey = monkeys[monkeyId]
    if (monkey.items.length < 1) continue

    for (let itemIdx = 0; itemIdx < monkey.items.length; itemIdx++) {
      monkey.inspectCount++

      // monkey inspects item
      let worryLevel = monkeyInspectsItem(
        monkey.operation,
        monkey.items[itemIdx]
      )

      // lower item worry level
      if (!magicDivisor) {
        monkey.items[itemIdx] = worryLevel = BigInt(worryLevel / BigInt(3))
      } else {
        monkey.items[itemIdx] = worryLevel = worryLevel % BigInt(magicDivisor)
      }

      // monkey throws item
      const testResult = itemMeetsInspectionTest(monkey.test, worryLevel)

      if (testResult === true) {
        monkeys[monkey.ifTrueMonkey].items.push(
          ...monkey.items.splice(itemIdx, 1)
        )
      } else {
        monkeys[monkey.ifFalseMonkey].items.push(
          ...monkey.items.splice(itemIdx, 1)
        )
      }

      // decrement itemIdx as items array is being reduced
      itemIdx--
    }
  }
}

const processGame = (
  monkeys: Monkey[],
  maxRounds: number,
  magicDivisor?: number
) => {
  for (let round = 0; round < maxRounds; round++) {
    processRound(monkeys, magicDivisor)
  }
}

const findMagicDivisor = (monkeys: Monkey[]): number => {
  return monkeys.map((m) => m.test.value).reduce((prev, curr) => prev * curr)
}

const partTwo = (monkeys: Monkey[]) => {
  processGame(monkeys, 10_000, findMagicDivisor(monkeys))
  const inspectCounts = monkeys.map((m) => m.inspectCount)

  console.log(
    "partTwo:",
    inspectCounts
      .sort((a, b) => b - a)
      .slice(0, 2)
      .reduce((prev, curr) => prev * curr)
  )
}

const partOne = (monkeys: Monkey[]) => {
  processGame(monkeys, 20)
  const inspectCounts = monkeys.map((m) => m.inspectCount)

  console.log(
    "partOne:",
    inspectCounts
      .sort((a, b) => b - a)
      .slice(0, 2)
      .reduce((prev, curr) => prev * curr)
  )
}

const main = () => {
  const file = readInputFile("src/11/input.txt")
  if (!file) return

  partOne(parseInput(file)) // t 10605, 61503
  partTwo(parseInput(file)) // t 2713310158, 14081365540
}

export default main
