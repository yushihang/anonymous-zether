function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

const Web3 = require("web3");
const web3 = new Web3("http://localhost:8545");
const provider = new Web3.providers.WebsocketProvider("ws://localhost:8545");

const path = require("path");
__dirname =
  "/Users/yushihang/Documents/HSBC/anonymous-zether/packages/protocol";
const Client = require(path.join(__dirname, "../anonymous.js/src/client.js"));

const contract = require("@truffle/contract");

let ZSCJSON, ZSC, zsc, CashTokenJSON, CashToken, cash, home;

(async () => {
  console.log("executing...");
  ZSCJSON = require(path.join(__dirname, "build/contracts/ZSC.json"));
  ZSC = contract(ZSCJSON);
  await sleep(1000);
  console.log("executing 2...");

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
  console.log("Cash minted and approved");
})();
