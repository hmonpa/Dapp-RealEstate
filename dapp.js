const Web3 = require('web3');
const auth = require('./src/auth');

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
        Dapp.account;
        // await Dapp.loadEthereum();
        // await Dapp.checkAccount();
        await Dapp.loadContracts();
        // await Dapp.removeProperty();
    },
    // ----------------- WALLET & ACCOUNT FUNCTIONS -----------------
    checkStatus: async() => {
        if (window.ethereum){
            Dapp.web3Provider = window.ethereum;
            Dapp.account = window.ethereum.selectedAddress;
            console.log(Dapp.account);
                // return Dapp.account;
            var accountInterval = setInterval(function() {
                Dapp.account = window.ethereum.selectedAddress;
                if (Dapp.account == null){
                    // auth.removeWallet();
                }
            }, 1000);
        }
    },

    // Loading network
    loadEthereum: async() => {
        if (window.ethereum){
            try {
                Dapp.web3Provider = window.ethereum;
                
                let accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
                Dapp.account = accounts[0];
                return Dapp.account;
                
            } catch (err) {
                console.log(err);
            }
        } 
        else {
            console.log('There is no Ethereum wallet installed. Try installing MetaMask');
            return 0;
        }
    },

    // Save the account of the current wallet
    // checkAccount: async() => {
    //     const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    //     Dapp.account = accounts[0];

    //     document.getElementById('account').innerText = Dapp.account;
    //     // document.querySelector('account').innerText = Dapp.account;
        
    //     return Dapp.account;
    //     // var account = Dapp.account;
    //     // console.log(Dapp.account);
    // },

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
    // -------------- PROPERTIES FUNCTIONS --------------
    uploadProperty: async(address, city, price) => {
        let res = await Dapp.Properties.uploadProperty(address, city, price, {
            from: Dapp.account
        })
        console.log(res);
        window.location.reload()
    },
    // ----------------- AUTH FUNCTIONS -----------------
    signIn: async(address, password) => {
        let user0 = await Dapp.Auth.usersByAddr(address);
        let res = await Dapp.Auth.signIn(address, password, {
            from: Dapp.account
        });
        
        user0 = await Dapp.Auth.usersByAddr(address);
        return user0.isLoggedIn;
    },

    signUp: async(address, name, email, password) => {
        await Dapp.Auth.signUp(address, name, email, password, {
            from: Dapp.account
        })
        let user = await Dapp.Auth.usersByAddr(address);
        let users = await Dapp.Auth.users;
        console.log(users);
    },

    tryToConnect: async(address, password) => {
       let user = await Dapp.Auth.usersByAddr(address);
       
       return user.password == password;
    },

    checkExists: async(address) => {
        let user = await Dapp.Auth.usersByAddr(address);
        let res = (user.email) ? 1 : 0;
        // console.log(user.password);
        return res; 
    },

    getName: async(address) => {
        let name = await Dapp.Auth.getName(address);
        
        return name;
    }

    // removeProperty: async(element) => {
    //     const propertyId = element.dataset.id;
    //     await Dapp.Properties.removeProperty(propertyId, {
    //         from: Dapp.account
    //     })

    //     window.location.reload()
    // },



};