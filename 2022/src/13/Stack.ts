class Stack<T> {
  data: T[]
  size: number

  constructor() {
    this.data = []
    this.size = 0
  }

  public add(data: T) {
    this.size++
    this.data.push(data)
  }

  public peek() {
    return this.data[this.data.length - 1]
  }

  public remove() {
    if (this.size < 1) return

    this.size--
    return this.data.pop()
  }
}

export default Stack

