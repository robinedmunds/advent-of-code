from main import Ship, ShipModule


def test_ship_method_totalMass():
    mass = 12
    ship = Ship(module_masses=[mass])
    assert ship.totalMass() == 12


def test_ship_method_fuelRequiredGross1():
    mass = 12
    ship = Ship(module_masses=[mass])
    assert ship.fuelRequiredGross() == 2


def test_ship_method_fuelRequiredGross2():
    mass = 14
    ship = Ship(module_masses=[mass])
    assert ship.fuelRequiredGross() == 2


def test_ship_method_fuelRequiredGross3():
    mass = 1969
    ship = Ship(module_masses=[mass])
    assert ship.fuelRequiredGross() == 654


def test_ship_method_fuelRequiredGross4():
    mass = 100756
    ship = Ship(module_masses=[mass])
    assert ship.fuelRequiredGross() == 33583
