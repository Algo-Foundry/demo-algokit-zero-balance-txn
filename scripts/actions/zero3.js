require("dotenv").config();
const algotxn = require("../helpers/algorand");
const algosdk = require("algosdk");

const algodClient = new algosdk.Algodv2(
  process.env.ALGOD_TOKEN,
  process.env.ALGOD_SERVER,
  process.env.ALGOD_PORT
);

(async () => {
  // THIS TXN WILL FAIL - Min balance of 0.1 Algo for accounts needs to be observed after payment txn is issued.
  // The app has only been funded with 1 Algo and will have 0 Algo after inner txn is issued.
  const appId = Number(process.env.APP_ID);
  const acc1 = algosdk.generateAccount();
  const creator = algosdk.mnemonicToSecretKey(process.env.CREATOR_MNEMONIC);

  // call the app to update global state
  // InnerTxn2 is an app call to issue inner payment txn
  const appArgs = [new Uint8Array(Buffer.from("InnerTxn2"))];

  const accounts = [acc1.addr];

  // app call txn by unfunded account
  let suggestedParams = await algodClient.getTransactionParams().do();

  suggestedParams.flatFee = true;
  suggestedParams.fee = 2000;
  const txn1 = algosdk.makeApplicationNoOpTxnFromObject({
    from: creator.addr,
    suggestedParams,
    appIndex: appId,
    appArgs,
    accounts,
  });

  const signedTxn = txn1.signTxn(creator.sk);

  console.log(await algotxn.submitToNetwork(signedTxn));
})();
