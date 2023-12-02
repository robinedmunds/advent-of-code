from main import Ship, ShipModule


def test_ship_method_totalMass():
    mass = 12
    ship = Ship(module_masses=[mass])
    assert ship.totalMass() == 12


def test_ship_method_fuelRequiredNet2():
    mass = 14
    ship = Ship(module_masses=[mass])
    assert ship.fuelRequiredNet() == 2


def test_ship_method_fuelRequiredNet3():
    mass = 1969
    ship = Ship(module_masses=[mass])
    assert ship.fuelRequiredNet() == 966


def test_ship_method_fuelRequiredNet4():
    mass = 100756
    ship = Ship(module_masses=[mass])
    assert ship.fuelRequiredNet() == 50346
