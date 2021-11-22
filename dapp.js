const Web3 = require('web3');

// https://www.trufflesuite.com/docs/truffle/advanced/build-processes
var authJson        = require('./build/contracts/Auth.json');
var propertiesJson  = require('./build/contracts/Properties.json');                     // Get the contracts
var TruffleContract = require('@truffle/contract');                                     // Turn that contract into an abstraction I can use

var Auth            = TruffleContract(authJson);
var Properties      = TruffleContract(propertiesJson);

// Provide the contracts with a web3 provider
Auth.setProvider(new Web3.providers.HttpProvider("http://127.0.0.1:7545"));
Properties.setProvider(new Web3.providers.HttpProvider("http://127.0.0.1:7545"));           

export const Dapp = {
    contracts: {},
    init: async() => {
        Dapp.Auth = Auth;
        Dapp.Properties = Properties;
        await Dapp.loadEthereum();
        await Dapp.checkAccount();
        await Dapp.loadContracts();
        // await Dapp.removeProperty();
    },

    // Loading network
    loadEthereum: async() => {
        if (window.ethereum){
            Dapp.web3Provider = window.ethereum
            await window.ethereum.request({ method: 'eth_requestAccounts' });
        } 
        else {
            console.log('There is no Ethereum wallet installed. Try installing MetaMask')
        }
    },

    // Save the account of the current wallet
    checkAccount: async() => {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        Dapp.account = accounts[0];

        document.getElementById('account').innerText = Dapp.account;
        // var account = Dapp.account;
        // console.log(Dapp.account);
    },

    // Load smart contracts
    loadContracts: async() => {
        // Variables of interest
        // const network       = await Dapp.Properties.detectNetwork();        // 5777
        // const networkType   = await Dapp.Properties.networkType;            // ethereum
        // const contractAddr  = await Dapp.Properties.address;                // contract address
        // const checkWeb3     = await Dapp.Properties.web3;

        // Auth contract will be deployed...
        Dapp.Auth = await Auth.deployed();
        console.log("Contract", Dapp.Auth.address, "is deployed done");

        // Properties contract will be deployed...
        Dapp.Properties = await Properties.deployed();
        console.log("Contract", Dapp.Properties.address, "is deployed done");
        
        // console.log(Auth.users);
    },

    uploadProperty: async(address, city, price) => {
        await Dapp.Properties.uploadProperty(address, city, price, {
            from: Dapp.account
        })
        window.location.reload()
    },

    // removeProperty: async(element) => {
    //     const propertyId = element.dataset.id;
    //     await Dapp.Properties.removeProperty(propertyId, {
    //         from: Dapp.account
    //     })

    //     window.location.reload()
    // },



};