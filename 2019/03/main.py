from enum import Enum
import numpy as np


class Direction(Enum):
    UP = 0
    RIGHT = 1
    DOWN = 2
    LEFT = 3


class Step:
    def __init__(self, string):
        self.direction = None
        self.length = None

        char = string[0].upper()
        if char == "U":
            self.direction = Direction.UP
        if char == "R":
            self.direction = Direction.RIGHT
        if char == "D":
            self.direction = Direction.DOWN
        if char == "L":
            self.direction = Direction.LEFT
        if char not in ["U", "R", "D", "L"]:
            raise Exception("Invalid direction character")
        self.length = int(string[1:])

    def __str__(self):
        return f"{self.direction.name}\t{self.length}"


class Wire:
    def __init__(self, string):
        self.steps = []

        arr = string.split(",")
        for i in arr:
            self.steps.append(
                Step(string=i)
            )

    def print_steps(self):
        output = ""
        for step in self.steps:
            output += f"{step}\n"
        print(output)


def import_steps_from_file(filename):
    f = open(filename, "r")
    wires = f.read().split("\n")
    if wires[-1] == "":
        wires.pop()
    f.close()
    return wires


def main():
    # wireA = Wire(string=import_steps_from_file(filename="input.txt")[0])
    # wireB = Wire(string=import_steps_from_file(filename="input.txt")[1])
    # wireA.print_steps()
    # wireB.print_steps()

    # wire1 = Wire(string="R75,D30,R83,U83,L12,D49,R71,U7,L72")
    # wire2 = Wire(string="U62,R66,U55,R34,D71,R55,D58,R83")
    # wire1.print_steps()
    # wire2.print_steps()

    # wire3 = Wire(string="U9,R9,D9,L9")
    wire3 = Wire(string="U9,R9")
    wire3.print_steps()

    a = np.zeros((1, 1), int)
    a[0, 0] = 8
    x = 0
    y = 0
    for s in wire3.steps:
        width = a.shape[1]
        height = a.shape[0]
        # print(f"w{width} x h{height}")
        if s.direction is Direction.UP:
            new_row = [0 for i in range(width)]
            new_row[x] = 1
            section = [new_row for i in range(s.length)]
            a = np.append(np.array(section), a, axis=0)
        if s.direction is Direction.RIGHT:
            new_col = [0 for i in range(height)]
            new_col[y] = 1
            section = [new_col for i in range(s.length)]
            a = np.append(a, np.array(section).transpose(), axis=1)
        if s.direction is Direction.DOWN:
            pass
        if s.direction is Direction.LEFT:
            pass

    print(a)
    print(f"w{a.shape[1]} x h{a.shape[0]}")


if __name__ == "__main__":
    main()
