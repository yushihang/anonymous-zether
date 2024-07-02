const fs = require("fs");

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
function capitalizeFirstLetter(str) {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

console.log("name = " + name);

const Web3 = require("web3");
const web3 = new Web3("http://localhost:8545");
const provider = new Web3.providers.WebsocketProvider("ws://localhost:8545");

const path = require("path");
__dirname =
  "/Users/yushihang/Documents/HSBC/web3/anonymous-zether/packages/protocol";
const Client = require(path.join(__dirname, "../anonymous.js/src/client.js"));

const contract = require("@truffle/contract");

let ZSCJSON, ZSC, zsc, CashTokenJSON, CashToken, cash, home;

(async () => {
  //console.log("executing...");
  ZSCJSON = require(path.join(__dirname, "build/contracts/ZSC.json"));
  ZSC = contract(ZSCJSON);
  await sleep(1000);
  //console.log("executing 2...");

  ZSC.setProvider(provider);
  await sleep(1000);
  await ZSC.deployed();
  await sleep(1000);
  ZSC.at(ZSC.address).then((result) => {
    zsc = result;
  });
  await sleep(1000);

  CashTokenJSON = require(path.join(
    __dirname,
    "build/contracts/CashToken.json"
  ));
  CashToken = contract(CashTokenJSON);
  await sleep(1000);
  CashToken.setProvider(provider);
  await sleep(1000);
  await CashToken.deployed();
  await sleep(1000);
  CashToken.at(CashToken.address).then((result) => {
    cash = result;
  });
  await sleep(1000);

  web3.eth.getAccounts().then((accounts) => {
    home = accounts[accounts.length - 1];
  });
  await sleep(1000);
  cash.mint(home, 1000, { from: home });
  await sleep(1000);
  cash.approve(zsc.address, 1000, { from: home });
  console.log(cash);

  eval(
    `globalThis.${name} = new Client(web3, zsc.contract, home); globalThis.${name}.register();`
  );
  await sleep(1000);

  console.log("public key:");
  publicKey = eval(`globalThis.${name}.account.public();`);
  publicKeyStr = JSON.stringify(publicKey);
  console.log(publicKeyStr);

  eval(`globalThis.${name}.deposit(100);`);

  await sleep(1000);

  const dirPath = "./pubkey";
  const filePath = path.join(dirPath, `${capitalizeFirstLetter(name)}.json`);

  const content = publicKeyStr;

  try {
    fs.writeFileSync(filePath, content);
    console.log("Write public key to file success!");
  } catch (err) {
    console.error("Write public key to file failed:", err);
  }

  await sleep(1000);
  console.log("account created for " + name);

  await sleep(3000);

  try {
    const fileNames = fs.readdirSync(dirPath);

    const jsonFiles = fileNames.filter((fileName) =>
      fileName.endsWith(".json")
    );

    console.log(jsonFiles);

    for (const fileName of jsonFiles) {
      const filePath = path.join(dirPath, fileName);
      const fileContent = fs.readFileSync(filePath, "utf8");
      const pubkey = JSON.parse(fileContent);
      if (
        Array.isArray(pubkey) &&
        pubkey.every((item) => typeof item === "string")
      ) {
        const friendsName = path.basename(fileName, ".json");
        if (friendsName.toLowerCase() !== name.toLowerCase()) {
          eval(
            `globalThis.${name}.friends.add("${friendsName}", ${fileContent});`
          );
          console.log(`add friend ${friendsName} with pubkey ${fileContent}`);
        }
      } else {
        console.warn(` ${fileName} content format error`);
      }
    }

    console.log("load friends pubkeys success");
  } catch (err) {
    console.error("load friends pubkeys failed", err);
  }
})();
