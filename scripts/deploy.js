require("dotenv").config();
const algosdk = require("algosdk");
const algotxn = require("./helpers/algorand");

(async () => {
  const creator = algosdk.mnemonicToSecretKey(process.env.CREATOR_MNEMONIC);

  // deploy apps
  const { confirmation } = await algotxn.deployDemoApp(
    creator,
    [0, 0, 0, 0],
    "sc_approval.teal",
    "sc_clearstate.teal"
  );
  const appId = confirmation["application-index"];
  console.log(`Deployed App ID is ${appId}. Save this app ID in the env file.`);

  // fund contract with 1 Algo + 0.1 Algos (min balance) - to be used for inner txn
  const appAddress = algosdk.getApplicationAddress(appId);
  await algotxn.fundAccount(creator, appAddress, 1e6);

  const { confirmation: confirmation2 } = await algotxn.deployDemoApp(
    creator,
    [0, 0, 0, 0],
    "sc2_approval.teal",
    "sc_clearstate.teal"
  );
  const appId2 = confirmation2["application-index"];
  console.log(
    `Deployed App ID 2 is ${appId2}. Save this app ID in the env file.`
  );
})();
