export default class BinaryTree {
    size: number
    nodes: string[]
    edges: [left: number, right: number][][]

    constructor() {
        this.size = 0
        this.nodes = []
        this.edges = []
    }

    private getNodeIdx(key: string) {
        for (let i = 0; i < this.nodes.length; i += 1) {
            if (this.nodes[i] === key) {
                return i
            }
        }
    }

    public addNode(key: string, left: string, right: string) {
        if (!this.getNodeIdx(key)) {
            this.nodes.push(key)
            this.edges.push([])
            this.size += 1
        }

        if (!this.getNodeIdx(left)) {
            this.nodes.push(left)
            this.edges.push([])
            this.size += 1
        }

        if (!this.getNodeIdx(right)) {
            this.nodes.push(right)
            this.edges.push([])
            this.size += 1
        }

        const keyIdx = this.getNodeIdx(key) as number
        const leftIdx = this.getNodeIdx(left) as number
        const rightIdx = this.getNodeIdx(right) as number

        this.edges[keyIdx].push([leftIdx, rightIdx])
    }
}
