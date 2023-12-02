class Stack<T> {
  size: number
  private data: T[]

  constructor() {
    this.size = 0
    this.data = []
  }

  public push(input: T) {
    this.size++
    this.data.push(input)
  }

  public pop() {
    if (this.size < 1) return

    this.size--
    return this.data.pop()
  }

  public peek() {
    return this.data[this.size - 1]
  }
}

export default Stack

