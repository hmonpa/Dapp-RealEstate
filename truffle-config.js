module.exports = {
  networks: {
    monpadev: {
      host: "localhost",
      port: 7545,
      network_id: "*",           // Any network (default: none)
      gas: 5000000               // in wei
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
};