import type { Rule } from "./AdjacencyList"

// dark orange bags contain 3 bright white bags, 4 muted yellow bags.

const parseRuleString = (line: string): Rule<string> => {
  const spaceSplit = line.split(" ")
  const parent = spaceSplit.slice(0, 2).join(" ")

  const containSplit = line.split(" contain ")[1].split(", ")
  const cleanContains = containSplit
    .map((s) => s.split(" ").slice(0, 3).join(" "))
    .filter((s) => (s === "no other bags." ? undefined : s))

  const rule: Rule<string> = { id: parent, edges: [] }

  for (const c of cleanContains) {
    const quantity = parseInt(c.split(" ")[0])
    const id = c.split(" ").slice(1, 3).join(" ")

    rule.edges.push({ toNode: id, quantity })
  }

  return rule
}

const parseInput = (file: string) => {
  const lines = file.split("\n")

  const parsedRules = []
  for (const line of lines) {
    parsedRules.push(parseRuleString(line))
  }

  return parsedRules
}

export default parseInput
