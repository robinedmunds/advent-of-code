// https://adventofcode.com/2020/day/2

import readInputFile from "../readFile"

class PasswordRule {
  char: string
  min: number
  max: number

  constructor(char: string, min: number, max: number) {
    this.char = char
    this.min = min
    this.max = max
  }
}

class Password {
  password: string
  rule: PasswordRule

  constructor(password: string, char: string, min: number, max: number) {
    this.password = password
    this.rule = new PasswordRule(char, min, max)
  }

  validate() {
    const charCount = this.password
      .split("")
      .filter((char) => char === this.rule.char).length

    return charCount >= this.rule.min && charCount <= this.rule.max
  }

  validateTwo() {
    let validCount = 0

    if (this.password[this.rule.min - 1] === this.rule.char) {
      validCount++
    }

    if (this.password[this.rule.max - 1] === this.rule.char) {
      validCount++
    }

    return validCount === 1
  }
}

const parseInput = (input: string) => {
  return input.split("\n")
}

const parseLine = (line: string) => {
  const password = line.split(": ")[1]
  const char = line.split(": ")[0].split(" ")[1]
  const min = parseInt(line.split(" ")[0].split("-")[0])
  const max = parseInt(line.split(" ")[0].split("-")[1])

  return new Password(password, char, min, max)
}

const main = () => {
  const file = readInputFile("src/02/input.txt")
  if (!file) return

  const input = parseInput(file).map((line) => parseLine(line))

  let validCount = 0

  for (const password of input) {
    const valid = password.validateTwo()

    if (valid) {
      validCount++
    }

    console.log(password, valid)
  }

  console.log("\ntotal valid:", validCount)
}

export default main

