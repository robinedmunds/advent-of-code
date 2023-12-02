import Stack from "./Stack"

type DeepNumbers = number | DeepNumbers[] | DeepNumbers[][]

class ParseTreeNode {
  parent?: ParseTreeNode
  data: (string | ParseTreeNode)[]

  constructor(parent?: ParseTreeNode) {
    this.parent = parent
    this.data = []
  }

  public getArray(): DeepNumbers[] {
    // const output: DeepNumbers[] = this.data.map((i) =>
    //   typeof i === "string" ? parseInt(i) : i.getArray()
    const output: DeepNumbers[] = []

    let tmp = ""
    for (const i of this.data) {
      if (i instanceof ParseTreeNode) {
        output.push(i.getArray())

        continue
      }

      if (i === ",") {
        if (!isNaN(parseInt(tmp))) {
          output.push(parseInt(tmp))
          tmp = ""

          continue
        }
      }

      tmp += i
    }

    // this.data.map((i) => (typeof i === "string" ? parseInt(i) : i.getArray()))

    console.log(output)

    return output
  }
}

class ParseTree {
  charStream: string[]
  stack: Stack<string>
  root: ParseTreeNode
  parsed: DeepNumbers[]

  constructor(charStream: string) {
    this.charStream = charStream.split("")
    this.root = new ParseTreeNode()
    this.stack = new Stack<string>()

    this.buildCharStack()
    this.recursiveParse(this.root)
    this.parsed = this.root.getArray()
  }

  // private addChildNode(parent: ParseTreeNode) {
  //   const newNode = new ParseTreeNode(parent)
  //   parent.data.push(newNode)

  //   return newNode
  // }

  private buildCharStack() {
    for (let i = this.charStream.length - 1; i >= 0; --i) {
      this.stack.add(this.charStream[i])
    }
  }

  private recursiveParse(node: ParseTreeNode) {
    // [[1],[2,3,4]]

    const currNode = node ?? this.root

    while (this.stack.size > 0) {
      const char = this.stack.remove()

      if (!char) {
        console.error("char is undefined")

        return currNode
      }

      if (char === "]") {
        return currNode
      }

      if (char === "[") {
        const childNode = this.recursiveParse(new ParseTreeNode(currNode))

        if (childNode instanceof ParseTreeNode === true) {
          currNode.data.push(childNode)
        }
      } else {
        // if ([","].includes(char) === false) {
        currNode.data.push(char)
        // }
      }
    }

    return currNode
  }
}

export type { DeepNumbers }
export default ParseTree
