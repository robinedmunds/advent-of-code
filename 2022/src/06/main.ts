// https://adventofcode.com/2022/day/6

import { assert } from "console"
import readInputFile from "../readFile"

const isValidHeader = (input: string): boolean => {
  return input.length === new Set(input.split("")).size
}

const findGenericHeaders = (memory: string, headerLength: number) => {
  const headerAddrs = []

  for (let i = 0; i < memory.length; ++i) {
    const mem = memory.slice(i, i + headerLength)

    if (isValidHeader(mem)) {
      headerAddrs.push(i + headerLength)
      i += headerLength
    }
  }

  return headerAddrs
}

const findPacketHeaderAddrs = (memory: string) => {
  const headerLength = 4

  return findGenericHeaders(memory, headerLength)
}

const findMessageHeaderAddrs = (memory: string) => {
  const headerLength = 14

  return findGenericHeaders(memory, headerLength)
}

const main = () => {
  const file = readInputFile("src/06/input.txt")
  if (!file) return

  console.log("partOne:", findPacketHeaderAddrs(file))
  console.log("partTwo:", findMessageHeaderAddrs(file))

  console.log("\n---\npart 1 asserts\n---")
  assert(findPacketHeaderAddrs("bvwbjplbgvbhsrlpgdmjqwftvncz")[0] === 5)
  assert(findPacketHeaderAddrs("nppdvjthqldpwncqszvftbrmjlhg")[0] === 6)
  assert(findPacketHeaderAddrs("nznrnfrfntjfmvfwmzdfjlvtqnbhcprsg")[0] === 10)
  assert(findPacketHeaderAddrs("zcfzfwzzqfrljwzlrfnpqdbhtmscgvjw")[0] === 11)

  console.log("\n---\npart 2 asserts\n---")
  assert(findMessageHeaderAddrs("mjqjpqmgbljsphdztnvjfqwrcgsmlb")[0] === 19)
  assert(findMessageHeaderAddrs("bvwbjplbgvbhsrlpgdmjqwftvncz")[0] === 23)
  assert(findMessageHeaderAddrs("nppdvjthqldpwncqszvftbrmjlhg")[0] === 23)
  assert(findMessageHeaderAddrs("nznrnfrfntjfmvfwmzdfjlvtqnbhcprsg")[0] === 29)
}

export default main
