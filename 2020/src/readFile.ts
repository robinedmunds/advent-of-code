import fs from "fs"

const readInputFile = (path: string) => {
  try {
    const data = fs.readFileSync(path, "utf8")

    return data
  } catch (err) {
    return console.error(err)
  }
}

export default readInputFile
