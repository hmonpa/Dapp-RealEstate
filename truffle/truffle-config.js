module.exports = {
  networks: {
    monpadev: {
      host: 'localhost',
      port: 7545,
      network_id: '*',           // In dev => Any network
      gas: 5000000
    }
  },
  compilers: {
    solc: {
      version: "0.4.24",
    }
  },
  solc: {
    optimizer: {
      enabled: true,
      runs: 500
    }
  }
};