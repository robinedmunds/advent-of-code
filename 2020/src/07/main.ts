// https://adventofcode.com/2020/day/7

import readInputFile from "../readFile"
import parseInput from "./parseInput"
import AdjacencyList from "./AdjacencyList"
import type { Rule } from "./AdjacencyList"

const buildRulesHashMap = (file: string) => {
  const rulesHashMap = new Map()

  for (const rule of parseInput(file)) {
    rulesHashMap.set(rule.id, rule)
  }

  return rulesHashMap
}

const partOne = (rulesHashMap: Map<string, Rule<string>>) => {
  const al = new AdjacencyList<string>()

  for (const rule of rulesHashMap.values()) {
    al.addNode(rule)
  }

  const seen = al.depthFirstSearchChildParent("shiny gold")

  console.log("partOne:", seen.length)
}

const partTwo = (rulesHashMap: Map<string, Rule<string>>) => {
  const al = new AdjacencyList<string>()

  for (const rule of rulesHashMap.values()) {
    al.addNode(rule)
  }

  const bagCount = al.depthFirstSearchParentChild("shiny gold")

  console.log("partTwo:", bagCount)
}

const main = () => {
  const file = readInputFile("src/07/input.txt")
  if (!file) return

  const rulesHashMap = buildRulesHashMap(file)

  partOne(rulesHashMap)
  partTwo(rulesHashMap)
}

export default main

