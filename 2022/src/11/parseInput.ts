type Operation = {
  a: string
  operator: string
  b: string
}

type Test = {
  test: string
  value: number
}

type Monkey = {
  id: number
  items: bigint[]
  operation: Operation
  test: Test
  ifTrueMonkey: number
  ifFalseMonkey: number
  inspectCount: number
}

const buildMonkeyObj = (id: number, monkeyStr: string[][]) => {
  const test = { test: monkeyStr[2][0], value: parseInt(monkeyStr[2][2]) }
  const operation = {
    a: monkeyStr[1][2],
    b: monkeyStr[1][4],
    operator: monkeyStr[1][3]
  }

  return {
    id,
    items: monkeyStr[0].map((str) => BigInt(str)),
    operation,
    test,
    ifTrueMonkey: parseInt(monkeyStr[3][3]),
    ifFalseMonkey: parseInt(monkeyStr[4][3]),
    inspectCount: 0
  }
}

const parseMonkey = (monkey: string) => {
  const lines = monkey.split("\n")
  const startingItems = lines[1].split(": ")[1].split(", ")
  const operation = lines[2].split(": ")[1].split(" ")
  const test = lines[3].split(": ")[1].split(" ")
  const trueAction = lines[4].split(": ")[1].split(" ")
  const falseAction = lines[5].split(": ")[1].split(" ")

  return [startingItems, operation, test, trueAction, falseAction]
}

const parseInput = (input: string) => {
  const monkeySplit = input.split("\n\n")
  const monkeys: Monkey[] = []

  for (let i = 0; i < monkeySplit.length; i++) {
    const monkeyArr = parseMonkey(monkeySplit[i])
    monkeys.push(buildMonkeyObj(i, monkeyArr))
  }

  return monkeys
}

export default parseInput
export type { Monkey, Test, Operation }
