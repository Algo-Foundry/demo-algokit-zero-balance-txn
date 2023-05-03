from pyteal import *


def clearstate():
    return Return(Int(1))


if __name__ == "__main__":
    clearstate = compileTeal(clearstate(), mode=Mode.Application, version=8)
    with open("./artifacts/sc_clearstate.teal", "w") as f:
        f.write(clearstate)
