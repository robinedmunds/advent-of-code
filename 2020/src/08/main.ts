// https://adventofcode.com/2020/day/8

import readInputFile from "../readFile"
import Computer from "./Computer"

const main = () => {
  const file = readInputFile("src/08/input.txt")
  if (!file) return

  const pc = new Computer()
  pc.loadInstructions(file)
  const output = pc.executeUntilHalt()

  // part 1
  console.log("accumulatorBeforeHalt:", output)

  // part 2
  const outputTwo = pc.executeUntilHaltTwo()
  console.log("accumulatorBeforeHaltTwo:", outputTwo)
}

export default main

