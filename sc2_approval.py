from pyteal import *


def approval_program():
    handle_creation = Approve()
    handle_optin = Reject()
    handle_closeout = Reject()
    handle_updateapp = Reject()
    handle_deleteapp = Reject()

    noop = Approve()

    handle_noop = Cond([Txn.application_args[0] == Bytes("NoOp"), noop])

    program = Cond(
        [Txn.application_id() == Int(0), handle_creation],
        [Txn.on_completion() == OnComplete.OptIn, handle_optin],
        [Txn.on_completion() == OnComplete.CloseOut, handle_closeout],
        [Txn.on_completion() == OnComplete.UpdateApplication, handle_updateapp],
        [Txn.on_completion() == OnComplete.DeleteApplication, handle_deleteapp],
        [Txn.on_completion() == OnComplete.NoOp, handle_noop],
    )

    return program


if __name__ == "__main__":
    approval = compileTeal(approval_program(), mode=Mode.Application, version=8)
    with open("./artifacts/sc2_approval.teal", "w") as f:
        f.write(approval)
