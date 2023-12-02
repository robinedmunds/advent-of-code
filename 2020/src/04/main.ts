// https://adventofcode.com/2020/day/4

import readInputFile from "../readFile"

const minMaxValidator = (
  value: string | undefined,
  min: number,
  max: number
): boolean => {
  if (!value) return false

  const integer = parseInt(value)

  if (isNaN(integer)) return false

  return integer >= min && integer <= max
}

class Passport {
  fields: Map<string, string>

  constructor(fields: string[]) {
    this.fields = new Map()

    for (const field of fields) {
      const [k, v] = field.split(":")
      this.fields.set(k, v)
    }
  }

  validate() {
    if (this.fields.size === 7 && !this.fields.has("cid")) return true
    if (this.fields.size > 7) return true

    return false
  }

  validateTwo(): boolean {
    const byr = minMaxValidator(this.fields.get("byr"), 1920, 2002)
    const iyr = minMaxValidator(this.fields.get("iyr"), 2010, 2020)
    const eyr = minMaxValidator(this.fields.get("eyr"), 2020, 2030)
    const hgt = (): boolean => {
      const value = this.fields.get("hgt")
      if (!value) return false

      const unit = value
        .split("")
        .slice(value.length - 2)
        .join("")
      const num = value.slice(0, value.length - 2)

      if (unit === "cm") {
        return minMaxValidator(num, 150, 193)
      }

      if (unit === "in") {
        return minMaxValidator(num, 59, 76)
      }

      return false
    }
    const hcl = (): boolean => {
      const value = this.fields.get("hcl")
      if (!value) return false

      const HEX = "0123456789abcdefABCDEF".split("")
      const arr = value.split("")

      if (arr[0] !== "#" || arr.length !== 7) {
        return false
      }

      for (const char of arr.slice(1)) {
        if (!HEX.includes(char)) {
          return false
        }
      }

      return true
    }
    const ecl = (): boolean => {
      const COLOURS = ["amb", "blu", "brn", "gry", "grn", "hzl", "oth"]

      const value = this.fields.get("ecl")
      if (!value) return false

      return COLOURS.includes(value)
    }
    const pid = (): boolean => {
      const DIGITS = "0123456789".split("")

      const value = this.fields.get("pid")
      if (!value) return false

      if (value.length !== 9) return false

      for (const char of value.split("")) {
        if (!DIGITS.includes(char)) {
          return false
        }
      }

      return true
    }
    const cid = true

    return byr && iyr && eyr && hgt() && hcl() && ecl() && pid() && cid
  }
}

const parsePassportFields = (passport: string) => {
  return passport
    .split(" ")
    .map((a) => a.split("\n"))
    .flat()
}

const parsePassports = (file: string) => {
  return file.split("\n\n").map((passport) => parsePassportFields(passport))
}

const main = () => {
  const file = readInputFile("src/04/input.txt")
  if (!file) return

  const passports = parsePassports(file).map((fields) => new Passport(fields))

  let validCountPartOne = 0
  let validCountPartTwo = 0
  for (const p of passports) {
    if (p.validate()) validCountPartOne++
    if (p.validateTwo()) validCountPartTwo++
  }

  console.log("validCountPartOne:", validCountPartOne)
  console.log("validCountPartTwo:", validCountPartTwo)
}

export default main

