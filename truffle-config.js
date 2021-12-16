const HDWalletProvider = require('truffle-hdwallet-provider');
const mnemonic = 'fun garment pudding day love other color bulk clarify have honey physical';

module.exports = {
  networks: {
    monpadev: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*",              // Any network
      gas: 5000000                  // Gas limit used for deploys (in wei)
    },
    kovan: {
      provider: () => new HDWalletProvider(mnemonic, "https://kovan.infura.io/v3/080c6e0ac83a44958a72bfa92a3f5110"),
      network_id: 42
    }
  },
  compilers: {
    solc: {
      optimizer: {
        enabled: true,
        runs: 200
      },
      // version: "0.4.24"
      version: "0.8.0"
    }
  },
  // environments: {
  //   ipfs: {
  //     address: "http://localhost:5002"
  //   }
  // }
};