// https://adventofcode.com/2022/day/2

import readInputFile from "../readFile"

enum Actions {
  Rock = "A",
  Paper = "B",
  Scissors = "C"
}

enum Responses {
  Rock = "X",
  Paper = "Y",
  Scissors = "Z"
}

enum ResponsesTwo {
  Lose = "X",
  Draw = "Y",
  Win = "Z"
}

enum RoundScore {
  WIN = 6,
  DRAW = 3,
  LOSS = 0
}

class Tournament {
  totalRounds: number
  roundScores: number[]
  myMoves: number[]

  constructor() {
    this.totalRounds = 0
    this.roundScores = []
    this.myMoves = []
  }

  totalScore() {
    return this.roundScores
      .concat(this.myMoves)
      .reduce((runningTotal, curr) => runningTotal + curr)
  }

  winningPercentage() {
    let winCount = 0

    for (const score of this.roundScores) {
      if (score === 6) {
        winCount++
      }
    }

    return winCount / this.totalRounds
  }

  processRoundTwo([action, response]: string[]) {
    switch (response) {
      case ResponsesTwo.Win:
        if (action === Actions.Rock) {
          return this.processRound([action, Responses.Paper])
        }

        if (action === Actions.Paper) {
          return this.processRound([action, Responses.Scissors])
        }

        if (action === Actions.Scissors) {
          return this.processRound([action, Responses.Rock])
        }

        break
      case ResponsesTwo.Draw:
        if (action === Actions.Rock) {
          return this.processRound([action, Responses.Rock])
        }

        if (action === Actions.Paper) {
          return this.processRound([action, Responses.Paper])
        }

        if (action === Actions.Scissors) {
          return this.processRound([action, Responses.Scissors])
        }

        break
      case ResponsesTwo.Lose:
        if (action === Actions.Rock) {
          return this.processRound([action, Responses.Scissors])
        }

        if (action === Actions.Paper) {
          return this.processRound([action, Responses.Rock])
        }

        if (action === Actions.Scissors) {
          return this.processRound([action, Responses.Paper])
        }

        break
    }
  }

  processRound([action, response]: string[]) {
    this.totalRounds++

    switch (response) {
      case Responses.Rock:
        this.myMoves.push(1)

        break
      case Responses.Paper:
        this.myMoves.push(2)

        break
      case Responses.Scissors:
        this.myMoves.push(3)

        break
    }

    switch (action) {
      case Actions.Rock:
        if (response === Responses.Paper) {
          this.roundScores.push(RoundScore.WIN)
        }

        if (response === Responses.Scissors) {
          this.roundScores.push(RoundScore.LOSS)
        }

        if (response === Responses.Rock) {
          this.roundScores.push(RoundScore.DRAW)
        }

        break
      case Actions.Paper:
        if (response === Responses.Scissors) {
          this.roundScores.push(RoundScore.WIN)
        }

        if (response === Responses.Rock) {
          this.roundScores.push(RoundScore.LOSS)
        }

        if (response === Responses.Paper) {
          this.roundScores.push(RoundScore.DRAW)
        }

        break
      case Actions.Scissors:
        if (response === Responses.Rock) {
          this.roundScores.push(RoundScore.WIN)
        }

        if (response === Responses.Paper) {
          this.roundScores.push(RoundScore.LOSS)
        }

        if (response === Responses.Scissors) {
          this.roundScores.push(RoundScore.DRAW)
        }

        break
    }
  }
}

const parseMoves = (input: string) => {
  if (!input) return

  const lines = input.split("\n")
  const moves = lines.map((line) => line.split(" "))

  return moves
}

const main = () => {
  const file = readInputFile("src/02/input.txt")
  if (!file) return

  const moves = parseMoves(file)
  if (!moves) return

  const tourney = new Tournament()
  const tourneyTwo = new Tournament()

  for (const move of moves) {
    tourney.processRound(move)
    tourneyTwo.processRoundTwo(move)
  }

  console.log("totalScore", tourney.totalScore())
  console.log("winningPercentage", tourney.winningPercentage())

  console.log("\nPart 2")
  console.log("totalScore", tourneyTwo.totalScore())
  console.log("winningPercentage", tourneyTwo.winningPercentage())
}

export default main

