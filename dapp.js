const Web3          = require('web3');
const auth          = require('./src/auth');
const axios         = require('axios');
const { jsPDF }     = require('jspdf');

// https://www.trufflesuite.com/docs/truffle/advanced/build-processes

var authJson        = require('./build/contracts/Auth.json');
var propertiesJson  = require('./build/contracts/Properties.json');                     // Get the contracts
var TruffleContract = require('@truffle/contract');                                     // Turn that contract into an abstraction I can use

var Auth            = TruffleContract(authJson);
var Properties      = TruffleContract(propertiesJson);

Properties.defaults({
    gas: 4712388,
    gasPrice: 100000000000
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
const web3 = new Web3("http://127.0.0.1:7545");

export const Dapp = {

    init: async() => {
        Dapp.Auth = Auth;
        Dapp.Properties = Properties;
        Dapp.account;
        Dapp.web3Provider;

        await Dapp.loadContracts();
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

    // Load the smart contracts
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
        
    },
    // -------------- PROPERTIES FUNCTIONS --------------
    propertyExists: async(id) => {
        let res = await Dapp.Properties.getPropertyById(id);
        return res;
    },

    uploadPropertyData: async(owner, rooms, area, bathrooms) => {
        await Dapp.Properties.addPropertyData(rooms, area, bathrooms, {
            from: owner
        });
    },

    uploadProperty: async(id, owner, city, addr, price, sellOrRent, tokens, rentalEndDate, cid) => {
        let priceInWei = await Dapp.convertEurToWei(price);

        await Dapp.Properties.uploadProperty(id, owner, city, addr, priceInWei, sellOrRent, tokens, rentalEndDate, cid, {
            from: owner
        });
    },

    buyProperty: async(from, id, value) => {
        try
        {
            return await Dapp.Properties.buyProperty(from, id, {
                from: from, 
                value: value
            });

        } catch (err) {
            return await web3.eth.getBalance(from);
        }
    },

    rentProperty: async(from, id, rentalEndDate, value) => {
        try
        {
            return await Dapp.Properties.rentProperty(from, id, rentalEndDate, {
                from: from, 
                value: value
            });

        } catch (err) {
            return await web3.eth.getBalance(from);
        }
    },

    buyTokens: async(from, id, tokensToBuy, priceToPay) => {
        try
        {
            return await Dapp.Properties.buyTokens(from, tokensToBuy, id, {
                from: from,
                value: priceToPay
            })
        } catch (err) {
            console.log(err);
        }
    },

    removeProperty: async(from, id) => {
        try {
            await Dapp.Properties.removeProperty(id, {
                from: from
            });
        } catch (err){
            console.log(err);
        }
    },

    // ----------------- AUTH FUNCTIONS -----------------
    signIn: async(address, password) => {
        // let gas = web3.eth.getGasPrice();
        
        let user0 = await Dapp.Auth.usersByAddr(address);
        
        await Dapp.Auth.signIn(address, password, {
            from: address
        });
    
        user0 = await Dapp.Auth.usersByAddr(address);
        return user0.isLoggedIn;
    },

    signUp: async(address, name, email, password, vatid, image) => {
        await Dapp.Auth.signUp(address, name, email, password, vatid, image, {
            from: address
        });
    },

    tryToConnect: async(address, password) => {
       let user = await Dapp.Auth.usersByAddr(address);
       
       return user.password == password;
    },

    checkExists: async(address) => {
        let user = await Dapp.Auth.usersByAddr(address);
        return (user.email) ? 1 : 0;
    },

    getUserData: async(address) => {
        return await Dapp.Auth.getUser(address);
    },

    // Get name from public key
    getPropertyOwner: async(owner) => {
        return await Dapp.Auth.getName(owner);
    },

    // Get current price of Ether
    getEtherPrice: async() => {
        try {
            const response = await axios.get('https://min-api.cryptocompare.com/data/pricemulti?fsyms=ETH&tsyms=EUR&api_key=b52b375c592aed093dc49d825345687e7d04cbfc9b3737b30138f33f3acb092a');
            
            const ETH = Object.values(response.data);
            return ETH[0]["EUR"];
        } catch (err) {
            console.log(err);
        }
    },

    // ----------------------- Currencies conversions ----------------------- 
    convertEurToWei: async(eur) => {
        let priceEthEur = await Dapp.getEtherPrice();
        let ethers = eur/priceEthEur;

        return web3.utils.toWei(ethers.toString(), 'ether');
    },

    convertWeiToEur: async(wei) => {
        let ethers = web3.utils.fromWei(wei, 'ether');
        let priceEthEur = await Dapp.getEtherPrice();
        // console.log(ethers*priceEthEur);
        return ethers*priceEthEur;
    },

    convertWeiToEth: async(wei) => {
        return web3.utils.fromWei(wei, 'ether');
    },

    // ----------------------- PDF generator ----------------------- 
    generatePDF: (content, filename) => {

        let doc = new jsPDF('p', 'mm', [1200, 1200]);
        
        let fixTemplate = content.replace(/\s/g, "&nbsp");
        fixTemplate = fixTemplate.replace(/(?<=\w)-(?=\w)/g, "&nbsp");
        fixTemplate += '<div><img style="margin: 10px 0px 0px 100px" src="https://ipfs.io/ipfs/QmQNw5BUgkP9YHbsLUW8gnXoHVeqomsv3j8scnjm6YcFBP"></div>';

        doc.html(fixTemplate, {
            callback: function(doc) {
                doc.save(filename);
            },
            x: 10,
            y: 10
        });
    }

};