// https://adventofcode.com/2022/day/10

import readInputFile from "../readFile"

type Op = {
  instruction: string
  value?: number
  cycles?: number
  running?: boolean
}

const parseInput = (input: string) => {
  return input
    .split("\n")
    .map((line) => line.split(" "))
    .map((arr) =>
      arr.length === 2
        ? { instruction: arr[0], value: parseInt(arr[1]) }
        : { instruction: arr[0] }
    )
}

class ClockCircuit {
  queue: Op[]
  cycleCount: number
  x: number
  log: number[]
  stack: Op[]

  constructor() {
    this.queue = []
    this.cycleCount = 0
    this.x = 1
    this.log = []
    this.stack = []
  }

  private addToExecutingStack(op: Op) {
    this.stack.unshift(op)
  }

  private popExecutingStack() {
    return this.stack.shift()
  }

  peekExecutingStack() {
    return this.stack[0]
  }

  run() {
    while (this.queue.length > 0) {
      this.cycle()
    }
  }

  cycle() {
    this.cycleCount++
    this.log.push(this.x)

    if (this.stack.length === 0) {
      const next = this.queue.shift()
      if (!next) return

      this.addToExecutingStack(next)
    }

    const curr = this.peekExecutingStack()

    if (!(typeof curr.cycles === "number") || curr.cycles < 0) {
      return console.error("Error: current op has no cycles attr", curr)
    }

    curr.cycles -= 1

    if (curr.cycles === 0) {
      if (curr.instruction === "addx" && curr.value) {
        this.x += curr.value
      }

      this.popExecutingStack()
      if (this.stack.length === 0) {
        const next = this.queue.shift()
        if (!next) return

        this.addToExecutingStack(next)
      }
    }

    return this.x
  }

  addOperation(op: Op) {
    if (op.instruction === "addx") {
      op.cycles = 2
      this.queue.push(op)
    } else if (op.instruction === "noop") {
      op.cycles = 1
      this.queue.push(op)
    } else {
      console.error("Error: addOperation. Unrecognised op instruction.")
    }
  }
}

const partTwo = (ops: Op[]) => {
  const cc = new ClockCircuit()
  // load instructions
  for (const op of ops) {
    cc.addOperation(op)
  }
  const screenWidth = 40
  const screenHeight = 6
  const screen = new Array(screenWidth * screenHeight).fill(".")

  for (let cycle = 1; cycle <= screenWidth * screenHeight; cycle++) {
    const spriteIdx = cc.x
    cc.cycle()

    // cycles count from index 1, sprites count from index 0
    const spriteZeroIdxMultiplier = Math.floor(cycle / screenWidth)
    const spriteStart = screenWidth * spriteZeroIdxMultiplier + spriteIdx
    const spriteEnd = screenWidth * spriteZeroIdxMultiplier + spriteIdx + 2

    if (spriteStart <= cycle && cycle <= spriteEnd) {
      screen[cycle - 1] = "#"
    }
  }

  // draw screen
  console.log("partTwo: -\n")

  for (let i = 0; i < screen.length; i += screenWidth) {
    console.log(screen.slice(i, i + screenWidth).join(""))
  }
}

const partOne = (ops: Op[]) => {
  const cc = new ClockCircuit()
  // load instructions
  for (const op of ops) {
    cc.addOperation(op)
  }

  cc.run()

  const signalStrengths = []
  for (const n of [20, 60, 100, 140, 180, 220]) {
    signalStrengths.push(cc.log[n - 1] * n)
  }

  console.log(
    "partOne:",
    signalStrengths.reduce((prev, curr) => prev + curr)
  )
}

const main = () => {
  const file = readInputFile("src/10/input.txt")
  if (!file) return
  const parsed = parseInput(file)

  partOne(parsed)
  partTwo(parsed)
}

export default main
