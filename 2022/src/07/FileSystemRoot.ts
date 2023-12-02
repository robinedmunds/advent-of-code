const ROOT = "root"

type FSObject = File | Directory

interface File {
  name: string
  size: number
}

class Directory {
  parent: Directory | "root"
  name: string
  itemCount: number
  contents: Map<string, FSObject>
  silentLogging: boolean
  logs: string[]

  constructor(parent: Directory | "root", name: string) {
    this.parent = parent
    this.name = name
    this.itemCount = 0
    this.contents = new Map()
    this.silentLogging = true
    this.logs = []
  }
}

class FileSystemRoot extends Directory {
  currentDirectory: Directory

  constructor() {
    super(ROOT, "/")

    this.currentDirectory = this
  }

  // ########## mutators ##########

  public createFileHere(name: string, size: number) {
    this.currentDirectory.contents.set(name, { name, size })
    this.currentDirectory.itemCount++
  }

  public createDirectoryHere(name: string) {
    if (this.nameAlreadyExistsInsideThisDir(name)) return

    this.currentDirectory.contents.set(
      name,
      new Directory(this.currentDirectory, name)
    )

    this.currentDirectory.itemCount++
  }

  private moveUpDirectoryTree() {
    const parentDir = this.currentDirectory.parent

    if (parentDir === ROOT) {
      return this.logger("Error: Already at top-level directory.")
    }

    this.currentDirectory = parentDir
  }

  private moveDownDirectory(name: string) {
    const dir = this.currentDirectory.contents.get(name)

    if (!(dir instanceof Directory)) {
      return this.logger("Error: Invalid directory.")
    }

    this.currentDirectory = dir
    this.logger(`\tcd to --> ${this.getFullPath()}\n`)
  }

  public changeDirectory(name: string) {
    if (name === this.name) {
      return (this.currentDirectory = this)
    }

    if (name === "..") {
      return this.moveUpDirectoryTree()
    }

    if (!this.getDirectoryNames(this.currentDirectory).includes(name)) {
      return this.logger(
        `Error: Directory ${name} does not exist in ${this.name}.`
      )
    }

    this.moveDownDirectory(name)
  }

  // ########## utils ##########

  private recursiveGetAllDirectoriesSizes(
    dirSizes: Map<string, number>,
    curr: Directory
  ) {
    const path = this.getFullPath(curr)
    const fileNames = this.getFileNames(curr)

    let size = 0
    for (const fileName of fileNames) {
      const file = curr.contents.get(fileName)

      if (file && !(file instanceof Directory)) {
        size += file.size
      }
    }

    const dirNames = this.getDirectoryNames(curr)

    for (const dirName of dirNames) {
      const dir = curr.contents.get(dirName)

      if (dir instanceof Directory) {
        size += this.recursiveGetAllDirectoriesSizes(dirSizes, dir)
      }
    }

    dirSizes.set(path, size)

    return size
  }

  public getAllDirectoriesSizes() {
    const root = this
    const dirSizes: Map<string, number> = new Map()

    this.recursiveGetAllDirectoriesSizes(dirSizes, root)

    // console.log(dirSizes)
    return dirSizes
  }

  public getFullPath(dir: Directory = this) {
    let curr = dir

    const arr = []
    while (curr.parent instanceof Directory) {
      arr.push(curr.name)
      curr = curr.parent
    }

    return "/" + arr.reverse().join("/")
  }

  private nameAlreadyExistsInsideThisDir(name: string): boolean {
    if (this.getContentNames(this.currentDirectory).includes(name)) {
      this.logger(
        `Error: A file or directory named ${name} already exists in this directory.`
      )

      return true
    }

    return false
  }

  private getContentNames(dir: Directory) {
    return [...dir.contents.keys()]
  }

  private getDirectoryNames(dir: Directory) {
    return [...dir.contents.values()]
      .filter((obj) => obj instanceof Directory === true)
      .map((obj) => obj.name)
  }

  private getFileNames(dir: Directory) {
    return [...dir.contents.values()]
      .filter((obj) => !(obj instanceof Directory))
      .map((obj) => obj.name)
  }

  private recurseDirectoryTree(
    root: FileSystemRoot,
    tree: string[],
    depth: number,
    curr: Directory
  ) {
    const dirNames = root.getDirectoryNames(curr)
    const fileNames = root.getFileNames(curr)
    if (!dirNames || dirNames.length < 1) return

    for (const dirName of dirNames) {
      if (!dirName) continue

      // space + |--- dir
      const prefixPart1 = new Array(depth * 5).fill(" ").join("")
      const prefixPart2 = "|--- "
      const dirLine = prefixPart1 + prefixPart2 + dirName

      // space doubled + |--- dir
      const fileLines = []
      for (const fileName of fileNames) {
        const prefixPart1 = new Array(depth * 5 * 2).fill(" ").join("")
        const prefixPart2 = "|--- "

        fileLines.push(prefixPart1 + prefixPart2 + fileName)
      }

      tree.push(dirLine, ...fileLines)

      const dir = curr.contents.get(dirName)
      if (!(dir instanceof Directory)) continue
      this.recurseDirectoryTree(root, tree, depth + 1, dir)
    }
  }

  // ########## output ##########

  public listContents() {
    const arr = []

    for (const obj of this.currentDirectory.contents.values()) {
      if (obj instanceof Directory) {
        arr.push(`dir\t${obj.name}`)
      } else {
        arr.push(`${obj.size}\t${obj.name}`)
      }
    }

    if (arr.length < 1) {
      return this.logger("---\n" + `${this.getFullPath()}\n\n` + "No files\n")
    }

    return this.logger(
      "------\n\n" +
        `${this.getFullPath()}\n\n` +
        `${arr.join("\n")}\n\n` +
        `${arr.length} items\n`
    )
  }

  public printTree() {
    const tree: string[] = [this.name]

    this.recurseDirectoryTree(this, tree, 0, this.currentDirectory)

    console.log(tree.join("\n"))
    this.logger(tree.join("\n"))
  }

  private logger(str: string) {
    this.logs.push(str)

    if (this.silentLogging === true) return

    if (str.split(" ")[0] === "Error:") {
      console.error(str)
    } else {
      console.log(str)
    }
  }

  public printLogs() {
    for (let i = 0; i < this.logs.length; ++i) {
      const line = this.logs[i]

      if (line.split(" ")[0] === "Error:") {
        console.error(`${i}\n${line}`)
      } else {
        console.log(`\n\n______\n${i}\n${line}`)
      }
    }
  }
}

export type { File, FSObject }
export { Directory, FileSystemRoot }
export default FileSystemRoot

