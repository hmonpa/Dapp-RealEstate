const Web3 = require('web3');

// https://www.trufflesuite.com/docs/truffle/advanced/build-processes
var propertiesJson  = require('./build/contracts/Properties.json');                     // Get the contracts
var authJson        = require('./build/contracts/Auth.json');
var TruffleContract = require('@truffle/contract');                                     // Turn that contract into an abstraction I can use

var Properties      = TruffleContract(propertiesJson);
var Auth            = TruffleContract(authJson);

// Provide the contracts with a web3 provider
Properties.setProvider(new Web3.providers.HttpProvider("http://127.0.0.1:7545"));           
Auth.setProvider(new Web3.providers.HttpProvider("http://127.0.0.1:7545"));

export const Dapp = {
    contracts: {},
    init: async() => {
        Dapp.Properties = Properties;
        console.log('Dapp loaded');
        await Dapp.loadEthereum();
        await Dapp.checkAccount();
        await Dapp.loadContracts();
        Dapp.render();
        await Dapp.renderProperties();
        await Dapp.uploadProperty();
        await Dapp.removeProperty();
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

    // Save the first account from Ganache
    checkAccount: async() => {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        Dapp.account = accounts[0];
        var account = Dapp.account;
        console.log(account);
    },

    // Load smart contracts
    loadContracts: async() => {
        // Variables of interest
        // const network       = await Dapp.Properties.detectNetwork();        // 5777
        // const networkType   = await Dapp.Properties.networkType;            // ethereum
        // const contractAddr  = await Dapp.Properties.address;                // contract address
        // const checkWeb3     = await Dapp.Properties.web3;

        // Properties contract will be deployed...
        Dapp.Properties = await Properties.deployed();
        console.log("Deployed done");
    },
    render: () => {
        document.getElementById('account').innerText = Dapp.account;
    },
    renderProperties: async() => {
        
        const propertyCounter = await Dapp.Properties.propertyCounter();
        const propertyCtrNum = propertyCounter.toNumber();

        let html = '';
        let properties = [];
        for(let i = 0; i < propertyCounter; i++){
            const property = await Dapp.Properties.properties(i);
            
            let id = property[0];
            let address = property[1];
            let city = property[2];
            let price = property[3].toNumber();
            let isSelled = property[4];

            let dateUploading = new Date(property[5]*1000).toLocaleString();

            let propertyElement = `
            <div>
                <span>PropertyId: ${id}</span>
                <br>
                <span>Location: ${city}</span>
                <br>
                <span>Owner: ${address}</span>
                <br>
                <span>Price: ${price}</span>
                <br>
                <span>Upload date: ${dateUploading}</span>
                <br>
                <input data-id="${id}" type="checkbox" 
                    ${isSelled && "checked"} onchange="removeProperty(this)"/>
                <br><br>
            </div>
            `
            html += propertyElement;
            properties.push(city, price, isSelled, dateUploading);

        }
        // console.log(properties);
        Dapp.allProperties = properties;
        document.querySelector('#propertyList').innerHTML = html;

    },
    uploadProperty: async(account, city, price) => {
        const res = await Dapp.Properties.uploadProperty(account, city, price, {
            from: Dapp.account
        })
        // console.log(res.logs[0].args)
        // window.location.reload()
    },
    removeProperty: async(element) => {
        const propertyId = element.dataset.id;
        await Dapp.Properties.removeProperty(propertyId, {
            from: Dapp.account
        })

        window.location.reload()
    }
};