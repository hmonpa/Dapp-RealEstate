Dapp = {
    init: () => {
        console.log('Loaded');
        Dapp.loadEthereum()
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
    }
}

Dapp.init();