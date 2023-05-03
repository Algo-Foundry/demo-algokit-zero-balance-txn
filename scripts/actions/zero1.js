require("dotenv").config();
const algotxn = require("../helpers/algorand");
const algosdk = require("algosdk");

const algodClient = new algosdk.Algodv2(
  process.env.ALGOD_TOKEN,
  process.env.ALGOD_SERVER,
  process.env.ALGOD_PORT
);

(async () => {
  // Unfunded accounts interacting with a dapp. A dapp builder can group an unfunded account app call with a fee paying transaction.
  const appId = Number(process.env.APP_ID);
  const creator = algosdk.mnemonicToSecretKey(process.env.CREATOR_MNEMONIC);
  const acc1 = algosdk.mnemonicToSecretKey(process.env.ACC1_MNEMONIC);
  const newAccount = algosdk.generateAccount();

  // call the app to update global state
  const appArgs = [new Uint8Array(Buffer.from("NoOp"))];

  // app call txn by unfunded account
  let suggestedParams = await algodClient.getTransactionParams().do();

  suggestedParams.flatFee = true;
  suggestedParams.fee = 0;
  const txn1 = algosdk.makeApplicationNoOpTxnFromObject({
    from: newAccount.addr,
    suggestedParams,
    appIndex: appId,
    appArgs,
  });

  // fee paying txn
  suggestedParams.flatFee = true;
  suggestedParams.fee = 2000;
  const txn2 = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
    from: creator.addr,
    to: acc1.addr,
    suggestedParams,
    amount: 1e5,
  });

  // process atomic
  const groupedTxns = algosdk.assignGroupID([txn1, txn2]);
  console.log(groupedTxns);
  const signedTxns = [
    groupedTxns[0].signTxn(newAccount.sk),
    groupedTxns[1].signTxn(creator.sk),
  ];

  await algotxn.submitToNetwork(signedTxns);
})();
