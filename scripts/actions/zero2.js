require("dotenv").config();
const algotxn = require("../helpers/algorand");
const algosdk = require("algosdk");

const algodClient = new algosdk.Algodv2(
  process.env.ALGOD_TOKEN,
  process.env.ALGOD_SERVER,
  process.env.ALGOD_PORT
);

(async () => {
  // Unfunded Smart Contract issuing inner transactions. Callers of the Smart Contract can cover the fees.
  const appId = Number(process.env.APP_ID);
  const appId2 = Number(process.env.APP_ID_2);
  const creator = algosdk.mnemonicToSecretKey(process.env.CREATOR_MNEMONIC);

  // call the app to update global state
  const appArgs = [new Uint8Array(Buffer.from("InnerTxn"))];

  const foreignApps = [appId2];

  // app call txn by unfunded account
  let suggestedParams = await algodClient.getTransactionParams().do();

  suggestedParams.flatFee = true;
  suggestedParams.fee = 2000;
  const txn1 = algosdk.makeApplicationNoOpTxnFromObject({
    from: creator.addr,
    suggestedParams,
    appIndex: appId,
    appArgs,
    foreignApps,
  });

  const signedTxn = txn1.signTxn(creator.sk);

  console.log(await algotxn.submitToNetwork(signedTxn));
})();
