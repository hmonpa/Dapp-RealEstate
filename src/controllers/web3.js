const Web3          = require('web3');
// const auth          = require('../../services/auth');

// https://www.trufflesuite.com/docs/truffle/advanced/build-processes
const authJson        = require('../../build/contracts/Auth.json');
const propertiesJson  = require('../../build/contracts/Properties.json');                     // Get the contracts
const TruffleContract = require('@truffle/contract');                                     // Turn that contract into an abstraction I can use

const Auth            = TruffleContract(authJson);
const Properties      = TruffleContract(propertiesJson);

Properties.defaults({
    gas: 4712388,                   // Gas limit
    gasPrice: 100000000000          // 100 GWei
});

// Provide the contracts with a web3 provider

// Kovan Testnet
// const testnet = 'https://kovan.infura.io/v3/080c6e0ac83a44958a72bfa92a3f5110';
// Auth.setProvider(new Web3.providers.HttpProvider(testnet));
// Properties.setProvider(new Web3.providers.HttpProvider(testnet));   
// const web3 = new Web3(testnet);


// Truffle local testnet
Auth.setProvider(new Web3.providers.HttpProvider("http://127.0.0.1:7545"));
Properties.setProvider(new Web3.providers.HttpProvider("http://127.0.0.1:7545"));   
// const web3 = new Web3("http://127.0.0.1:7545");

export const Web3Controller = {

    init: async() => {
        Web3Controller.Auth = Auth;
        Web3Controller.Properties = Properties;
        Web3Controller.account;
        Web3Controller.web3Provider;

        await Web3Controller.loadContracts();
    },

    // ----------------- WALLET & ACCOUNT FUNCTIONS -----------------
    
    // Return the account connected in MetaMask
    currentAddr: async() => {
        return window.ethereum.selectedAddress;
    },

    // Open MetaMask to choose an account (public key)
    loadEthereum: async() => {
        if (window.ethereum){
            try {
                Web3Controller.web3Provider = window.ethereum;
                
                let accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
                Web3Controller.account = accounts[0];
                return Web3Controller.account;
                
            } catch (err) {
                console.log(err);
            }
        } 
        else {
            console.log('There is no Ethereum wallet installed. Try installing MetaMask');
            return 0;
        }
    },

    // Load the smart contracts
    loadContracts: async() => {
        // Variables of interest
        // const network       = await Web3Controller.Properties.detectNetwork();        // 5777
        // const networkType   = await Web3Controller.Properties.networkType;            // ethereum
        // const contractAddr  = await Web3Controller.Properties.address;                // contract address
        // const checkWeb3     = await Web3Controller.Properties.web3;

        // Auth contract will be deployed...
        Web3Controller.Auth = await Auth.deployed();
        console.log("Contract", Web3Controller.Auth.address, "is deployed done");

        // Properties contract will be deployed...
        Web3Controller.Properties = await Properties.deployed();
        console.log("Contract", Web3Controller.Properties.address, "is deployed done");
    }


};