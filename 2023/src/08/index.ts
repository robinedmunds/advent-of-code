// https://adventofcode.com/2023/day/8

import readInputFile from "../readFile"

const FILTER = "ABCDEFGHIJKLMNOPQRSTUVWXYZ " as const

function parseInput(path: string) {
    const file = readInputFile(path)
    if (!file) throw "Parsing error!"

    const [line1, block] = file.split("\r\n\r\n")
    const directions = line1.split("") as ("L" | "R")[]
    const map: [string, string, string][] = block.split("\r\n").map((line) =>
        line
            .split("")
            .filter((c) => FILTER.includes(c))
            .join("")
            .split(" ")
            .filter((c) => c !== "")
    ) as [string, string, string][]

    return { path: directions, map }
}

class BinaryTree {
    size: number
    nodes: string[]
    edges: [left: number, right: number][]
    path: ("L" | "R")[]

    constructor(path: ("L" | "R")[]) {
        this.size = 0
        this.nodes = []
        this.edges = []
        this.path = path
    }

    private getNodeIdx(key: string) {
        for (let i = 0; i < this.nodes.length; i += 1) {
            if (this.nodes[i] === key) {
                return i
            }
        }

        return -1
    }

    public addNode(key: string, left: string, right: string) {
        if (this.getNodeIdx(key) === -1) {
            this.nodes.push(key)
            this.size += 1
        }

        if (this.getNodeIdx(left) === -1) {
            this.nodes.push(left)
            this.size += 1
        }

        if (this.getNodeIdx(right) === -1) {
            this.nodes.push(right)
            this.size += 1
        }

        const leftIdx = this.getNodeIdx(left) as number
        const rightIdx = this.getNodeIdx(right) as number

        this.edges.push([leftIdx, rightIdx])
    }

    public walkPath(): number {
        const aaaIdx = this.getNodeIdx("AAA")
        const zzzIdx = this.getNodeIdx("ZZZ")

        let currIdx = aaaIdx
        let pathIdx = 0
        let count = 0
        while (currIdx !== zzzIdx) {
            const [left, right] = this.edges[currIdx]

            if (this.path[pathIdx] === "L") {
                currIdx = left
            }

            if (this.path[pathIdx] === "R") {
                currIdx = right
            }

            pathIdx += 1
            if (pathIdx >= this.path.length) {
                pathIdx = 0
            }

            count += 1
        }

        return count
    }
}

function partOne() {
    // const { path, map } = parseInput("src/08/input.test.txt")
    // const { path, map } = parseInput("src/08/input.test2.txt")
    const { path, map } = parseInput("src/08/input.txt")
    const binaryTree = new BinaryTree(path)
    for (const [key, left, right] of map) {
        binaryTree.addNode(key, left, right)
    }

    console.log(binaryTree)
    console.log(binaryTree.walkPath())
}

function partTwo() {}

console.log("DAY 8")
console.log(partOne())
// console.log(partTwo())
