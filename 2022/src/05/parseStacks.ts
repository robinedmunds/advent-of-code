const rotateStringNinetyDegrees = (input: string) => {
  const lines = input.split("\n")
  const height = lines.length
  const width = Math.max(...lines.map((line) => line.length))

  const rotated: string[][] = []

  for (let x = 0; x < width; ++x) {
    const row: any = []

    for (let y = 0; y < height; ++y) {
      if (lines[y][x]) {
        row.push(lines[y][x])
      }
    }

    rotated.push(row.reverse().join(""))
  }

  return rotated.join("\n")
}

const cleanString = (input: string): string => {
  return input
    .replace(/\ /g, "")
    .replace(/[\[\]]/g, "")
    .replace(/\n+/g, "\n")
}

const parseStack = (file: string): string[] => {
  const stackString = file.split("\n\n")[0]

  const parsedStack = cleanString(rotateStringNinetyDegrees(stackString))
    .split("\n")
    .filter((i) => (i.length > 0 ? i : undefined))

  return parsedStack
}

export default parseStack

