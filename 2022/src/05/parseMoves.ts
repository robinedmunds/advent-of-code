type Move = {
  quantity: number
  fromLocation: number
  toLocation: number
}

const parseMoves = (file: string): Move[] => {
  const rawMovesString = file.split("\n\n")[1]
  const rawMoves = rawMovesString.split("\n")

  const parsedMoves = []

  for (const move of rawMoves) {
    const split = move.split(" ")

    parsedMoves.push({
      quantity: parseInt(split[1]),
      fromLocation: parseInt(split[3]),
      toLocation: parseInt(split[5])
    })
  }

  return parsedMoves
}

export type { Move }
export default parseMoves

