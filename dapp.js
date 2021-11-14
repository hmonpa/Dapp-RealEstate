const Web3 = require('web3');

// https://www.trufflesuite.com/docs/truffle/advanced/build-processes
var propertiesJson = require('./build/contracts/Properties.json');                          // Get a contract into the dapp
var TruffleContract = require('@truffle/contract');                                 // Turn that contract into an abstraction I can use
var Properties = TruffleContract(propertiesJson);

Properties.setProvider(new Web3.providers.HttpProvider("http://127.0.0.1:7545"));   // Provide the contract with a web3 provider

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
        const network       = await Dapp.Properties.detectNetwork();        // 5777
        const networkType   = await Dapp.Properties.networkType;            // ethereum
        const contractAddr  = await Dapp.Properties.address;                // contract address
        const checkWeb3     = await Dapp.Properties.web3;

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

        for(let i = 1; i <= propertyCounter; i++){
            const property = await Dapp.Properties.properties(i);
            const id = property[0];
            const city = property[1];
            const price = property[2].toNumber();
            const isSelled = property[3];

            const dateUploading = property[4];

            let propertyElement = `
            <div>
                <br>
                <span>Location: ${city}</span>
                <br>
                <span>Price: ${price}</span>
                <br>
                <span>Upload date: ${new Date(dateUploading*1000).toLocaleString()}</span>
                <br>
                <input data-id="${id}" type="checkbox" 
                    ${isSelled && "checked"} onchange="Dapp.removeProperty(this)"/>
                <br><br>
            </div>
            `
            html += propertyElement;
        }
        document.querySelector('#propertyList').innerHTML = html;
    },
    uploadProperty: async(city, price) => {
        const res = await Dapp.Properties.uploadProperty(city, price, {
            from: Dapp.account
        })
        // console.log(res.logs[0].args)
        window.location.reload()
    },
    removeProperty: async(element) => {
        const propertyId = element.dataset.id;
        await Dapp.Properties.removeProperty(propertyId, {
            from: Dapp.account
        })

        window.location.reload()
    }
};