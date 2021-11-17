module.exports = {
  networks: {
    monpadev: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*",              // Any network
      gas: 5000000                  // Gas limit used for deploys (in wei)
    }
  },
  compilers: {
    solc: {
      optimizer: {
        enabled: true,
        runs: 200
      },
      version: "0.4.24"
    }
  },
  environments: {
    ipfs: {
      address: "http://localhost:5002"
    }
  }
};