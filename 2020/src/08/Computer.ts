enum InstructionSet {
  NoOperation = "nop",
  Accumulator = "acc",
  JumpTo = "jmp"
}

enum HaltType {
  CONTINUE = "CONTINUE",
  REPEATED = "REPEATED",
  SUCCESS = "SUCCESS",
  NULL_MEMORY = "NULL_MEMORY"
}

class Operation {
  instruction: string
  data: number
  executed: boolean

  constructor(instruction: string, data: number) {
    this.instruction = instruction
    this.data = data
    this.executed = false
  }

  public setExecutionComplete() {
    this.executed = true
  }
}

class Computer {
  accumulator: number
  instructions: Operation[]
  instructionIdx: number
  opsCount: number
  haltType: string

  constructor() {
    this.accumulator = 0
    this.instructions = []
    this.instructionIdx = 0
    this.opsCount = 0
    this.haltType = ""
  }

  public loadInstructions(input: string) {
    const split = input.split("\n").map((line) => line.split(" "))

    const operations: Operation[] = []
    for (const [instruction, data] of split) {
      operations.push(new Operation(instruction, parseInt(data)))
    }

    this.instructions.push(...operations)
  }

  public executeUntilHalt() {
    while (this.executeNextOperation() === HaltType.CONTINUE) {}

    return this.accumulator
  }

  private executeNextOperation(): string {
    const op = this.instructions[this.instructionIdx]

    if (this.instructionIdx === this.instructions.length) {
      this.haltType = HaltType.SUCCESS

      return HaltType.SUCCESS
    }

    if (!op) {
      console.error("Error: op not found")
      this.haltType = HaltType.NULL_MEMORY

      return HaltType.NULL_MEMORY
    }

    if (op.executed === true) {
      this.haltType = HaltType.REPEATED

      return HaltType.REPEATED
    }

    switch (op.instruction) {
      case InstructionSet.NoOperation:
        op.setExecutionComplete()
        this.instructionIdx++

        break
      case InstructionSet.Accumulator:
        this.accumulator += op.data
        op.setExecutionComplete()
        this.instructionIdx++

        break
      case InstructionSet.JumpTo:
        op.setExecutionComplete()
        this.instructionIdx += op.data

        break
    }

    this.opsCount++
    this.haltType = HaltType.CONTINUE

    return HaltType.CONTINUE
  }

  private getInstructionIndexes(instructionType: string) {
    const indexes = []

    for (let i = 0; i < this.instructions.length; ++i) {
      const { instruction } = this.instructions[i]

      if (instruction === instructionType) {
        indexes.push(i)
      }
    }

    return indexes
  }

  private getAllPotentiallyCorruptIndexes() {
    const corruptibleInstructions = [
      InstructionSet.NoOperation,
      InstructionSet.JumpTo
    ]

    const indexes = []
    for (const ins of corruptibleInstructions) {
      indexes.push(this.getInstructionIndexes(ins))
    }

    return indexes.flat()
  }

  private rewriteOneInstruction(idx: number | undefined) {
    if (typeof idx !== "number" || idx < 0) return

    for (let i = 0; i < this.instructions.length; ++i) {
      if (i !== idx) continue

      if (this.instructions[i].instruction === InstructionSet.JumpTo) {
        this.instructions[i].instruction = InstructionSet.NoOperation
      } else {
        this.instructions[i].instruction = InstructionSet.JumpTo
      }
    }
  }

  public executeUntilHaltTwo() {
    const corruptibleIndexes = this.getAllPotentiallyCorruptIndexes()

    for (let i = -1; i < corruptibleIndexes.length; ++i) {
      // execute first time around with untouched memory

      // rewrite memory
      const corruptIdx: number | undefined = corruptibleIndexes[i]
      this.rewriteOneInstruction(corruptIdx)

      // execute until completion
      while (true) {
        const output = this.executeNextOperation()

        if (output !== HaltType.CONTINUE) {
          break
        }
      }

      if (this.haltType === HaltType.SUCCESS) {
        return this.accumulator
      }

      // reset computer to original state
      this.rewriteOneInstruction(corruptIdx)
      this.accumulator = 0
      this.instructionIdx = 0
      this.opsCount = 0
      this.haltType = ""
      for (const ins of this.instructions) {
        ins.executed = false
      }
    }

    console.error("Error: Failed to find SUCCESS ending memory.")
  }
}

export default Computer

