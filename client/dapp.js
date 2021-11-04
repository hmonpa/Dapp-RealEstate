Dapp = {
    contracts: {},
    init: async() => {
        console.log('Dapp loaded');
        await Dapp.loadEthereum()
        await Dapp.checkAccount()
        await Dapp.loadContracts()
        Dapp.render()
        await Dapp.renderProperties()
        await Dapp.uploadProperty()
        await Dapp.isSelled()
    },
    loadEthereum: async() => {
        if (window.ethereum){
            Dapp.web3Provider = window.ethereum
            await window.ethereum.request({ method: 'eth_requestAccounts' });
        // } else if (window.web3) {
        //     web3 = new Web3(window.web3.currentProvider)
        // }
        } else {
            console.log('No ethereum browser is installed. Try it installing MetaMask')
        }
    },
    // Save the first account from Ganache
    checkAccount: async() => {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        Dapp.account = accounts[0];
    },
    loadContracts: async() => {
        const res = await fetch("Properties.json");
        const propertiesJSON = await res.json();
        
        Dapp.contracts.PropertiesContract = await TruffleContract(propertiesJSON);
        Dapp.contracts.PropertiesContract.setProvider(Dapp.web3Provider);

        // PropertiesContract is deployed...
        Dapp.PropertiesContract = await Dapp.contracts.PropertiesContract.deployed();
    },
    render: () => {
        document.getElementById('account').innerText = Dapp.account;
    },
    renderProperties: async() => {
        const propertyCounter = await Dapp.PropertiesContract.propertyCounter();
        const propertyCtrNum = propertyCounter.toNumber();
        console.log(propertyCtrNum);

        let html = '';

        for(let i = 1; i <= propertyCounter; i++){
            const property = await Dapp.PropertiesContract.properties(i);
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
        const res = await Dapp.PropertiesContract.uploadProperty(city, price, {
            from: Dapp.account
        })
        // console.log(res.logs[0].args)
        window.location.reload()
    },
    removeProperty: async(element) => {
        const propertyId = element.dataset.id;
        await Dapp.PropertiesContract.removeProperty(propertyId, {
            from: Dapp.account
        })

        window.location.reload()
    }
}