type Edge<T> = {
  toNode: T
  quantity: number
}

type Rule<T> = {
  id: T
  edges: Edge<T>[]
}

class AdjacencyList<T> {
  vertexCount: number
  edgeCount: number
  vertices: T[]
  edges: number[][]

  constructor() {
    this.vertexCount = 0
    this.edgeCount = 0
    this.vertices = []
    this.edges = []
  }

  private indexOfVertex(id: T): number {
    return this.vertices.indexOf(id)
  }

  public getIdOf(idx: number) {
    return this.vertices[idx]
  }

  private addVertex(id: T): number {
    const idx = this.indexOfVertex(id)
    if (idx > -1) return idx

    this.vertices.push(id)

    return this.vertexCount++
  }

  public addNode(rule: Rule<T>): void {
    const vertexIdx = this.addVertex(rule.id)

    for (const relation of rule.edges) {
      const toVertexIdx = this.addVertex(relation.toNode)

      this.edges.push([vertexIdx, toVertexIdx, relation.quantity])
      this.edgeCount++
    }
  }

  public getParentChildEdges(parentIdx: number): number[][] {
    const childEdges = this.edges.filter((edge) =>
      edge[0] === parentIdx ? edge : undefined
    )

    return childEdges
  }

  public getChildParentEdges(childIdx: number): number[][] {
    const parentEdges = this.edges.filter((edge) =>
      edge[1] === childIdx ? edge : undefined
    )

    return parentEdges
  }

  private recursiveDepthFirstSearchChildParent(
    seen: number[],
    currentIdx: number
  ) {
    const parentEdges = this.getChildParentEdges(currentIdx)

    for (const edge of parentEdges) {
      if (!seen.includes(edge[0])) {
        seen.push(edge[0])
      }

      this.recursiveDepthFirstSearchChildParent(seen, edge[0])
    }
  }

  public depthFirstSearchChildParent(id: T) {
    const needleIdx = this.indexOfVertex(id)

    if (needleIdx < 0) return []

    const seen: number[] = []
    this.recursiveDepthFirstSearchChildParent(seen, needleIdx)

    return seen.map((idx) => this.vertices[idx])
  }

  private recursiveDepthFirstSearchParentChild(
    currentIdx: number,
    quantities: number[],
    prevQuantity: number = 1
  ) {
    const childEdges = this.getParentChildEdges(currentIdx)

    for (const [, toIdx, quantity] of childEdges) {
      quantities.push(prevQuantity * quantity)

      this.recursiveDepthFirstSearchParentChild(
        toIdx,
        quantities,
        prevQuantity * quantity
      )
    }
  }

  public depthFirstSearchParentChild(id: T) {
    const needleIdx = this.indexOfVertex(id)

    const quantities: number[] = []
    this.recursiveDepthFirstSearchParentChild(needleIdx, quantities)
    const bagCount = quantities.reduce((prev, curr) => prev + curr)

    return bagCount
  }
}

export type { Rule, Edge }
export default AdjacencyList

