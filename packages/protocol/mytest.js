const fs = require("fs");

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

console.log("__dirname = " + __dirname);

const Web3 = require("web3");
const web3 = new Web3("http://localhost:8545");
const provider = new Web3.providers.WebsocketProvider("ws://localhost:8545");

const path = require("path");

const Client = require(path.join(__dirname, "../anonymous.js/src/client.js"));

const contract = require("@truffle/contract");
const { assert } = require("console");

let ZSCJSON, ZSC, zsc, CashTokenJSON, CashToken, cash, home;
let alice;
let bob;
let carol;
let dave;
let miner;
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
    home = accounts[0];
  });
  await sleep(1000);
  cash.mint(home, 1000, { from: home });
  await sleep(1000);
  cash.approve(zsc.address, 1000, { from: home });
  console.log(cash);

  alice = new Client(web3, zsc.contract, home);
  bob = new Client(web3, zsc.contract, home);
  carol = new Client(web3, zsc.contract, home);
  dave = new Client(web3, zsc.contract, home);
  miner = new Client(web3, zsc.contract, home);

  await Promise.all([
    alice.register(),
    bob.register(),
    carol.register(),
    dave.register(),
    miner.register(),
  ]);

  await alice.deposit(100);
  assert(alice.account.balance() === 100, "Alice deposit failed");
  await alice.withdraw(10);
  assert(alice.account.balance() === 90, "Alice withdraw failed");

  alice.friends.add("Bob", bob.account.public());
  alice.friends.add("Carol", carol.account.public());
  alice.friends.add("Dave", dave.account.public());
  alice.friends.add("Miner", miner.account.public());

  assert(
    Object.keys(alice.friends.show()).length == 4,
    "Alice add friend failed"
  );
  console.log("==== transfer to Bob 1st ====");
  await alice.transfer("Bob", 10, ["Carol", "Dave"], "Miner");
  await sleep(2000);
  assert(bob.account.balance() === 10, "Bob received transfer failed");
  assert(alice.account.balance() === 80, "Alice transfer failed");

  const fee = await zsc.fee.call();
  console.log("miner.account.balance():", miner.account.balance());
  assert(miner.account.balance() == fee, "Fees failed");

  console.log("==== transfer to Bob 2nd ====");
  await alice.transfer("Bob", 10, ["Carol", "Dave"], "Miner");
  await sleep(2000);
  assert(alice.account.balance() === 70, "Alice transfer failed");
  console.log("bob.account.balance()", bob.account.balance());
  //assert(carol.account.balance() === 10, "Carol received transfer failed");
})();
