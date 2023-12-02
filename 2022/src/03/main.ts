// https://adventofcode.com/2022/day/3

import readInputFile from "../readFile"

const ITEM_TYPES = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ".split(
  ""
)

const separateCompartments = (rucksack: string) => {
  const allItems: string[] = rucksack.split("")

  const upper = allItems.splice(Math.floor(allItems.length / 2))

  return [allItems, upper]
}

const getItemPriority = (item: string) => {
  return ITEM_TYPES.indexOf(item) + 1
}

const findItemsInBothCompartments = (rucksack: string) => {
  const duplicates: string[] = []
  const compartments = separateCompartments(rucksack)

  for (const item of compartments[0]) {
    if (compartments[1].includes(item) && !duplicates.includes(item)) {
      duplicates.push(item)
    }
  }

  return duplicates
}

const separateGroups = (rucksacks: string[], groupSize: number = 3) => {
  const groups: string[][] = []

  for (let i = 0; i < rucksacks.length; i += groupSize) {
    groups.push(rucksacks.slice(i, i + groupSize))
  }

  return groups
}

const deduplicateItems = (rucksack: string) => {
  return new Array(...new Set(rucksack.split("")))
}

const findCommonItemInGroup = (group: string[]) => {
  const groupWithDedupedItems = group.map((ruck) => deduplicateItems(ruck))
  const itemCountHashMap = new Map()
  const itemsHeldByAll: string[] = []

  for (const group of groupWithDedupedItems) {
    for (const item of group) {
      if (!itemCountHashMap.has(item)) {
        itemCountHashMap.set(item, 1)
      } else {
        itemCountHashMap.set(item, itemCountHashMap.get(item) + 1)
      }
    }
  }

  for (const [key, itemCount] of itemCountHashMap.entries()) {
    if (itemCount === group.length) {
      itemsHeldByAll.push(key)
    }
  }

  if (itemsHeldByAll.length !== 1) {
    console.error(
      "ERROR: findCommonItemInGroup found no, or more than one unique item in group."
    )
  }

  return itemsHeldByAll[0]
}

const main = () => {
  const file = readInputFile("src/03/input.txt")
  if (!file) return

  const rucksacks = file.split("\n")

  const allDuplicates: string[][] = []
  for (const ruck of rucksacks) {
    allDuplicates.push(findItemsInBothCompartments(ruck))
  }

  const duplicatePriorities: number = allDuplicates
    .flat()
    .map((a) => getItemPriority(a))
    .reduce((running, curr) => running + curr)

  console.log("duplicatePriorities", duplicatePriorities)

  // part 2

  const groupIdentifiers: string[] = []
  for (const group of separateGroups(rucksacks)) {
    groupIdentifiers.push(findCommonItemInGroup(group))
  }

  const groupIdentifierPriorities = groupIdentifiers
    .map((item) => getItemPriority(item))
    .reduce((running, curr) => running + curr)

  console.log("groupIdentifierPriorities", groupIdentifierPriorities)
}

export default main
