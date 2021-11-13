import Web3 from 'web3';

var TruffleContract = require('@truffle/contract');
// var network = require('./migrations/1_deploy_contract');
const Properties = require('./build/contracts/Properties.json');

export const Dapp = {
    contracts: {},
    init: async() => {
        console.log('Dapp loaded');
        // console.log(typeof(Properties));
        console.log('Contract:', Properties);
        await Dapp.loadEthereum()
        await Dapp.checkAccount()
        // setTimeout(await Dapp.loadContracts, 3000);
        await Dapp.loadContracts()
        // Dapp.render()
        await Dapp.renderProperties()
        await Dapp.uploadProperty()
        await Dapp.isSelled()
    },
    // Loading network
    loadEthereum: async() => {
        if (window.ethereum){
            Dapp.web3Provider = window.ethereum
            await window.ethereum.request({ method: 'eth_requestAccounts' });
        } 
        else {
            console.log('No ethereum browser is installed. Try it installing MetaMask')
        }
    },
    // Save the first account from Ganache
    checkAccount: async() => {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        Dapp.account = accounts[0];
        console.log(Dapp.account);
    },
    // Load smart contracts
    loadContracts: async() => {
        // Obj to JSON
        const propertiesJSON = await JSON.stringify(Properties);
        Dapp.contracts.Properties = await TruffleContract(propertiesJSON);
        // Some tests for solve contractName problems
        var provider = new Web3.providers.HttpProvider("http://localhost:7545");
        Dapp.contracts.Properties.setProvider(provider);
        console.log(Dapp.contracts.Properties.toJSON())

        // Some vars
        const network = await Dapp.contracts.Properties.detectNetwork();        // 5777
        // const networkType = await Dapp.contracts.Properties.networkType;     // ethereum
        // const contractAddr = await Dapp.contracts.Properties.address();      // contract address
        
        // Properties contract will be deployed...
        Dapp.Properties = await Dapp.contracts.Properties.deployed();
        console.log(Dapp.Properties);
        console.log("prueba");
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