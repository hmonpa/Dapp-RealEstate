const axios         = require('axios');

export const CurrenciesController = {

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

    convertEurToWei: async(eur) => {
        let priceEthEur = await CurrenciesController.getEtherPrice();
        let ethers = eur/priceEthEur;

        return web3.utils.toWei(ethers.toString(), 'ether');
    },

    convertWeiToEur: async(wei) => {
        let ethers = web3.utils.fromWei(wei, 'ether');
        let priceEthEur = await CurrenciesController.getEtherPrice();
        // console.log(ethers*priceEthEur);
        return ethers*priceEthEur;
    },

    convertWeiToEth: async(wei) => {
        return web3.utils.fromWei(wei, 'ether');
    }
}