// https://adventofcode.com/2022/day/9

import readInputFile from "../readFile"

type Coords = {
  x: number
  y: number
}

const parseInput = (file: string) => {
  return file
    .split("\n")
    .map((line) => line.split(" "))
    .map((arr) => [arr[0], parseInt(arr[1])])
}

const addColumns = (
  board: string[][],
  side: "left" | "right",
  amount: number
) => {
  for (let i = 0; i < amount; ++i) {
    for (const row of board) {
      if (side === "right") row.push(".")
      if (side === "left") row.unshift(".")
    }
  }
}

const addRows = (board: string[][], side: "top" | "bottom", amount: number) => {
  for (let i = 0; i < amount; ++i) {
    if (side === "bottom") board.push(new Array(board[0].length).fill("."))
    if (side === "top") board.unshift(new Array(board[0].length).fill("."))
  }
}

const addTailVisitedColumns = (
  tailVisited: boolean[][],
  side: "left" | "right",
  amount: number
) => {
  for (let i = 0; i < amount; ++i) {
    for (const row of tailVisited) {
      if (side === "right") row.push(false)
      if (side === "left") row.unshift(false)
    }
  }
}

const addTailVisitedRows = (
  tailVisited: boolean[][],
  side: "top" | "bottom",
  amount: number
) => {
  for (let i = 0; i < amount; ++i) {
    if (side === "bottom")
      tailVisited.push(new Array(tailVisited[0].length).fill(false))
    if (side === "top") {
      tailVisited.unshift(new Array(tailVisited[0].length).fill(false))
    }
  }
}

const growBoard = (
  board: string[][],
  head: Coords,
  coordsToAdjust: Coords[],
  tailVisited: boolean[][]
) => {
  if (head.x > board[0].length - 1) {
    const growAmount = head.x - board[0].length + 1

    addColumns(board, "right", growAmount)
    addTailVisitedColumns(tailVisited, "right", growAmount)
  }

  if (head.x < 0) {
    const growAmount = Math.abs(head.x)

    addColumns(board, "left", growAmount)
    addTailVisitedColumns(tailVisited, "left", growAmount)
    head.x = 0

    for (let i = 0; i < coordsToAdjust.length; ++i) {
      coordsToAdjust[i].x += growAmount
    }
  }

  if (head.y > board.length - 1) {
    const growAmount = head.y - board.length + 1

    addRows(board, "bottom", growAmount)
    addTailVisitedRows(tailVisited, "bottom", growAmount)
  }

  if (head.y < 0) {
    const growAmount = Math.abs(head.y)

    addRows(board, "top", growAmount)
    addTailVisitedRows(tailVisited, "top", growAmount)
    head.y = 0

    for (let i = 0; i < coordsToAdjust.length; ++i) {
      coordsToAdjust[i].y += growAmount
    }
  }
}

const headWalk = (head: Coords, direction: string) => {
  switch (direction) {
    case "R":
      head.x += 1

      break
    case "L":
      head.x -= 1

      break
    case "D":
      head.y += 1

      break
    case "U":
      head.y -= 1
  }

  return head
}

const tailWalk = (head: Coords, tail: Coords): Coords => {
  const yDifference = Math.abs(tail.y + 1 - (head.y + 1))
  const xDifference = Math.abs(tail.x + 1 - (head.x + 1))

  // close enough all axes
  if (yDifference <= 1 && xDifference <= 1) return tail

  if (xDifference <= 1) {
    if (head.y > tail.y) {
      tail.y += 1
    } else {
      tail.y -= 1
    }

    tail.x = head.x
  } else if (yDifference <= 1) {
    if (head.x > tail.x) {
      tail.x += 1
    } else {
      tail.x -= 1
    }

    tail.y = head.y
  }

  return tail
}

const partTwo = (moves: any[]) => {
  const board = [["S"]]
  const start: Coords = { x: 0, y: 0 }
  const tailVisited: boolean[][] = [[true]]
  const joints: Coords[] = []
  const head: Coords = { x: 0, y: 0 }
  for (let i = 0; i < 3; ++i) joints.push({ x: 0, y: 0 })
  const tail: Coords = joints[joints.length - 1]

  for (const [direction, distance] of moves) {
    for (let step = 0; step < distance; ++step) {
      headWalk(head, direction)
      growBoard(board, head, [start, ...joints], tailVisited)

      tailWalk(head, joints[0])
      for (let idx = 1; idx < joints.length - 1; ++idx) {
        tailWalk(joints[idx], joints[idx + 1])
      }

      // tailVisited[tail.y][tail.x] = true

      // // console output
      // board[start.y][start.x] = "s"111

      // const lastWrittenCoords = { x: -1, y: -1 }
      // for (let i = 0; i < joints.length; ++i) {
      //   if (
      //     lastWrittenCoords.y === joints[i].y &&
      //     lastWrittenCoords.x === joints[i].x
      //   )
      //     break
      //   // board[joints[i].y][joints[i].x] = `${i + 1}`
      //   lastWrittenCoords.y = joints[i].y
      //   lastWrittenCoords.x = joints[i].x
      // }
      // board[head.y][head.x] = "H"
      // console.log(direction, distance, ":", step + 1)
      // for (const row of board) {
      //   console.log(row.join(""))
      // }

      // // clear board
      // for (let y = 0; y < board.length; ++y) {
      //   for (let x = 0; x < board[0].length; ++x) {
      //     board[y][x] = "."
      //   }
      // }

      // console.log("\n\n")
    }
  }

  console.log("head", head)
  console.log("knots", joints)

  // console.log(
  //   "partTwo:",
  //   tailVisited
  //     .slice()
  //     .flat()
  //     .filter((bool) => bool === true).length
  // )
}

const partOne = (moves: any[]) => {
  const board = [["S"]]
  const start: Coords = { x: 0, y: 0 }
  const head: Coords = { x: 0, y: 0 }
  const tail: Coords = { x: 0, y: 0 }
  const tailVisited: boolean[][] = [[true]]

  for (const [direction, distance] of moves) {
    for (let step = 0; step < distance; ++step) {
      headWalk(head, direction)
      growBoard(board, head, [start, tail], tailVisited)
      tailWalk(head, tail)

      tailVisited[tail.y][tail.x] = true

      // // console output
      // board[start.y][start.x] = "s"
      // board[head.y][head.x] = "H"
      // board[tail.y][tail.x] = "T"

      // console.log(direction, distance)
      // for (const row of board) {
      //   console.log(row.join(""))
      // }
      // board[head.y][head.x] = "."
      // board[tail.y][tail.x] = "."

      // console.log("\n\n")
    }
  }

  console.log(
    "partOne:",
    tailVisited
      .slice()
      .flat()
      .filter((bool) => bool === true).length
  )
}

const main = () => {
  const file = readInputFile("src/09/input_test.txt")
  if (!file) return

  // partOne(parseInput(file))
  partTwo(parseInput(file))
}

export default main
