type Coords = { x: number; y: number }
type Edge = { from: number; to: number; elevationChange: number }

const DIRECTIONS: Map<string, number[]> = new Map() // y, x
DIRECTIONS.set("up", [-1, 0])
DIRECTIONS.set("right", [0, 1])
DIRECTIONS.set("down", [1, 0])
DIRECTIONS.set("left", [0, -1])

class AdjacencyList {
  start: Coords
  end: Coords
  strGrid: string[][]
  numGrid: number[][]
  vertices: Coords[]
  vertexLookup: Map<string, number>
  edges: Edge[]
  shortestPath: Coords[]
  partTwoPaths: Coords[][]

  constructor(file: string) {
    this.strGrid = file.split("\n").map((line) => line.split(""))
    const { start, end } = this.findStartAndEndCoords()
    this.start = start
    this.end = end
    this.numGrid = this.buildNumberGrid()
    this.vertices = []
    this.vertexLookup = new Map()
    this.edges = []
    this.shortestPath = []
    this.partTwoPaths = []

    this.buildAdjacencyList()
    this.dijkstra()
  }

  // ========= part two =========

  public partTwo = () => {
    const allACoords: Coords[] = []

    for (let y = 0; y < this.numGrid.length; y++) {
      for (let x = 0; x < this.numGrid[0].length; x++) {
        if (this.numGrid[y][x] === 0) {
          allACoords.push({ x, y })
        }
      }
    }

    allACoords.filter((coords) => this.vertexLookup.has(JSON.stringify(coords)))

    for (const coords of allACoords) {
      this.dijkstra(coords)
    }
  }

  // ========= dijkstra =========

  private hasUnvisitedEdges = (
    visited: boolean[],
    distances: number[]
  ): boolean => {
    return visited.some(
      (visited, idx) => visited === false && distances[idx] < Infinity
    )
  }

  private getLowestUnvisited = (visited: boolean[], distances: number[]) => {
    let idx = -1
    let lowestDistance = Infinity

    for (let i = 0; i < visited.length; i++) {
      if (visited[i] === true) continue

      if (lowestDistance > distances[i]) {
        lowestDistance = distances[i]

        idx = i
      }
    }

    return idx
  }

  private dijkstra = (startCoords?: Coords) => {
    const visited = new Array(this.vertices.length).fill(false)
    const previous = new Array(this.vertices.length).fill(-1)
    const distances = new Array(this.vertices.length).fill(Infinity)

    const startIdx = this.vertexLookup.get(
      JSON.stringify(startCoords || this.start)
    )
    if (typeof startIdx !== "number") return
    distances[startIdx] = 0

    while (this.hasUnvisitedEdges(visited, distances)) {
      const currentIdx = this.getLowestUnvisited(visited, distances)
      visited[currentIdx] = true

      const adjacentEdges = this.edges.filter((e) => e.from === currentIdx)

      for (let i = 0; i < adjacentEdges.length; i++) {
        const adjacent = adjacentEdges[i]

        if (visited[adjacent.to] === true) continue

        const distance = distances[currentIdx] + 1

        if (distance < distances[adjacent.to]) {
          distances[adjacent.to] = distance
          previous[adjacent.to] = currentIdx
        }
      }
    }

    // output

    const output: number[] = []

    const endIdx = this.vertexLookup.get(JSON.stringify(this.end))
    if (typeof endIdx !== "number") return
    let curr = endIdx

    while (previous[curr] !== -1) {
      output.push(curr)
      curr = previous[curr]
    }

    output.push(startIdx)

    if (startCoords) {
      if (output.length === 1) return
      this.partTwoPaths.push(output.reverse().map((idx) => this.vertices[idx]))
    } else {
      this.shortestPath = output.reverse().map((idx) => this.vertices[idx])
    }
  }

  // ========= adjacency list =========

  private buildAdjacencyList = () => {
    for (let y = 0; y < this.numGrid.length; y++) {
      for (let x = 0; x < this.numGrid[0].length; x++) {
        const currCoords = { x, y }
        if (!this.vertexLookup.has(JSON.stringify(currCoords))) {
          this.addVertex(currCoords)
        }
        let currIdx = this.vertexLookup.get(JSON.stringify(currCoords))

        for (const [direction, [plusY, plusX]] of DIRECTIONS.entries()) {
          const adjacent = { x: x + plusX, y: y + plusY }

          // out of bounds
          if (
            adjacent.y >= this.numGrid.length ||
            adjacent.x >= this.numGrid[0].length ||
            adjacent.y < 0 ||
            adjacent.x < 0
          )
            continue

          if (!this.vertexLookup.has(JSON.stringify(adjacent))) {
            this.addVertex(adjacent)
          }
          const adjacentIdx = this.vertexLookup.get(JSON.stringify(adjacent))

          if (currIdx === undefined || adjacentIdx === undefined) {
            return console.error("Error: invalid vertex indexes")
          }

          if (this.numGrid[adjacent.y][adjacent.x] <= this.numGrid[y][x] + 1) {
            const elevationChange =
              this.numGrid[y][x] - this.numGrid[adjacent.y][adjacent.x]
            const edge = { from: currIdx, to: adjacentIdx, elevationChange }
            this.edges.push(edge)
          }
        }
      }
    }
  }

  private addVertex = (coords: Coords) => {
    const idx = this.vertices.length
    this.vertices.push(coords)
    this.vertexLookup.set(JSON.stringify(coords), idx)

    return idx
  }

  // ========= parsing input =========

  private findStartAndEndCoords = () => {
    const coords = { start: { x: -1, y: -1 }, end: { x: -1, y: -1 } }

    for (let y = 0; y < this.strGrid.length; y++) {
      for (let x = 0; x < this.strGrid[0].length; x++) {
        if (this.strGrid[y][x] === "S") {
          coords.start.y = y
          coords.start.x = x
        }

        if (this.strGrid[y][x] === "E") {
          coords.end.y = y
          coords.end.x = x
        }
      }
    }

    return coords
  }

  private getLetterIdx = (char: string) => {
    if (!char || char.length !== 1) {
      console.error("Error: getLetterIdx accepts only 1 character.")
      return -1
    }

    const alphabet = "abcdefghijklmnopqrstuvwxyz"

    return alphabet.indexOf(char)
  }

  private buildNumberGrid = () => {
    const numGrid = []

    for (let y = 0; y < this.strGrid.length; y++) {
      const row = []

      for (let x = 0; x < this.strGrid[0].length; x++) {
        const char = this.strGrid[y][x]
        if (char === "S") {
          row.push(this.getLetterIdx("a"))
        } else if (char === "E") {
          row.push(this.getLetterIdx("z"))
        } else {
          row.push(this.getLetterIdx(char))
        }
      }

      numGrid.push(row)
    }

    return numGrid
  }
}

export default AdjacencyList

