# Zero Balance Transactions

Demo for zero balance transactions. Covers these 2 scenarios

1. Unfunded accounts interacting with a dapp. A dapp builder can group an unfunded account app call with a fee paying transaction.
2. Unfunded Smart Contract issuing inner transactions. Callers of the Smart Contract can cover the fees.

## Setup instructions

### Install python packages via AlgoKit
run `algokit bootstrap poetry` within this folder

### Install JS packages
run `yarn install`

### Update environement variables
1. Copy `.env.example` to `.env`
2. Update Algorand Sandbox credentials in `.env` file
3. Update accounts in `.env` file

### Compile contracts
1. run `python sc_approval.py`
2. run `python sc_clearstate.py`
3. run `python sc2_approval.py`
4. Update app IDs in `.env` file

### Run demo
1. Unfunded accounts interacting with a dapp. A dapp builder can group an unfunded account app call with a fee paying transaction.
```
node scripts/actions/zero1.js
```
2. Unfunded Smart Contract issuing inner app call transaction. Callers of the Smart Contract can cover the fees.
```
node scripts/actions/zero2.js
```
3. Unfunded Smart Contract issuing inner payment transaction. Callers of the Smart Contract can cover the fees.
```
node scripts/actions/zero3.js
```