from math import floor


class ShipModule:
    def __init__(self, mass=None):
        self.mass = mass

    def __fuelEquation(self, mass):
        fuel = floor(mass / 3) - 2
        if fuel > 0:
            return fuel
        return 0

    def __recursiveFuel(self, mass):
        fuel1 = self.__fuelEquation(mass)
        fuel2 = 0
        if fuel1 != 0:
            fuel2 = self.__recursiveFuel(fuel1)
        return fuel1 + fuel2

    def fuelRequiredGross(self):
        if isinstance(self.mass, (int, float)) is False:
            raise Exception("Invalid mass value. Must be int or float.")
        return self.__fuelEquation(self.mass)

    def fuelRequiredNet(self):
        if isinstance(self.mass, (int, float)) is False:
            raise Exception("Invalid mass value. Must be int or float.")
        return self.__recursiveFuel(self.mass)


class Ship:
    def __init__(self, module_masses=[]):
        self.modules = [ShipModule(mass=mass) for mass in module_masses]

    def moduleCount(self):
        return len(self.modules)

    def totalMass(self):
        return sum([module.mass for module in self.modules])

    def fuelRequiredGross(self):
        return sum([module.fuelRequiredGross() for module in self.modules])

    def fuelRequiredNet(self):
        return sum([module.fuelRequiredNet() for module in self.modules])


def importShipModulesFromFile():
    f = open("ship_modules.txt", "r")
    masses = []
    for line in f.read().split("\n"):
        if line != "":
            masses.append(float(line))
    f.close()
    return masses


def main():
    ship = Ship(module_masses=importShipModulesFromFile())

    print(f"Number of ship modules:\t{ship.moduleCount()}")
    print(f"Total mass of ship:\t{ship.totalMass()}")
    print(f"Total fuel required (gross):\t{ship.fuelRequiredGross()}")
    print(f"Total fuel required (net):\t{ship.fuelRequiredNet()}")


if __name__ == "__main__":
    main()
