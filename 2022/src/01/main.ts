// https://adventofcode.com/2022/day/1

import readInputFile from "../readFile"

class Elf {
  id: number
  items: number[]

  constructor(id: number, items: number[]) {
    this.id = id
    this.items = items
  }

  public totalCalories() {
    return this.items.reduce((runningTotal, curr) => runningTotal + curr)
  }
}

class Inventory {
  total: number
  elves: Elf[]

  constructor() {
    this.total = 0
    this.elves = []
  }

  addElf(id: number, items: number[]) {
    this.elves.push(new Elf(id, items))
    this.total++
  }

  getElfWithMostCalories() {
    return this.elves
      .map((a) => a)
      .sort((a, b) => b.totalCalories() - a.totalCalories())[0]
  }

  getThreeElvesWithMostCalories() {
    return this.elves
      .map((elf) => elf)
      .sort((a, b) => b.totalCalories() - a.totalCalories())
      .slice(0, 3)
  }

  getTotalCaloriesOfTopElf() {
    if (this.total < 1) return 0

    return this.getElfWithMostCalories().totalCalories()
  }

  getTotalCaloriesOfThreeElves() {
    if (this.total < 1) return 0

    return this.getThreeElvesWithMostCalories()
      .map((elf) => elf.totalCalories())
      .reduce((prev, curr) => {
        return prev + curr
      })
  }
}

const main = () => {
  const file = readInputFile("src/01/input.txt")
  if (!file) return

  const parseInput: number[][] = file
    .split("\n\n")
    .map((inv) => inv.split("\n").map((i) => parseInt(i)))

  const inventory = new Inventory()

  for (let i = 0; i < parseInput.length; ++i) {
    inventory.addElf(i, parseInput[i])
  }

  console.log("getTotalCaloriesOfTopElf:", inventory.getTotalCaloriesOfTopElf())
  console.log(
    "getTotalCaloriesOfThreeElves:",
    inventory.getTotalCaloriesOfThreeElves()
  )
}

export default main
