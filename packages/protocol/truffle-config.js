module.exports = {
  networks: {
    development: {
      host: "localhost",
      port: 8545, // ganache
      gasPrice: 0,
      network_id: "*", // Match any network id
      websockets: true,
    },
    qex: {
      host: "localhost",
      port: 22000, // node1 in quorum examples
      gasPrice: 0,
      network_id: "*",
      websockets: true,
    },
  },
  compilers: {
    solc: {
      version: "0.7.0",
    },
  },
};
