from enum import Enum
from math import floor


class Opcode(Enum):
    ADD = 1
    MULTIPLY = 2
    HALT = 99


def import_memory_from_file():
    f = open("input.txt", "r")
    memory = f.read().split(",")
    f.close()
    memory.pop()
    return list(map(lambda a: int(a), memory))


def addition(a, b):
    return a + b


def multiplication(a, b):
    return a * b


def read_memory_address(memory, addr):
    return memory[addr]


def get_instructions(memory):
    step = 4
    instructions = []
    for i in range(0, len(memory), step):
        instructions.append(
            memory[i:i+step]
        )
    return instructions


def processor(memory):
    for instruction in get_instructions(memory):
        opcode = Opcode(instruction[0])
        param1 = read_memory_address(memory=memory, addr=instruction[1])
        param2 = read_memory_address(memory=memory, addr=instruction[2])
        target_addr = instruction[3]

        if opcode == Opcode.ADD:
            memory[target_addr] = addition(param1, param2)
        if opcode == Opcode.MULTIPLY:
            memory[target_addr] = multiplication(param1, param2)

        # print(f"{opcode}\t\t\t{param1}\t{param2}\t{target_addr}")


def main():
    for noun in range(99):
        for verb in range(99):
            memory = import_memory_from_file()
            memory[1] = noun
            memory[2] = verb
            processor(memory)

            print(f"\naddr0: {memory[0]}\n")
            if memory[0] == 19690720:
                print(f"noun: {noun} - verb: {verb}")
                break
        if memory[0] == 19690720:
            break


if __name__ == "__main__":
    main()
