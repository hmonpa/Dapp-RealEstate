const Properties = artifacts.require('Properties');
const Web3 = require("web3")

contract('Properties', () => {
    before(async() => {
        this.Properties = await Properties.deployed();
    });

    it('contract deployed successfully', async() => {
        const address = this.Properties.address;

        assert.notEqual(address, null);
        assert.notEqual(address, undefined);
        assert.notEqual(address, 0x0);
        assert.notEqual(address, "");
    });

    it('get properties list', async() => {
        const propertyCounter = await this.Properties.propertyCounter();
        const property = await this.Properties.properties(propertyCounter);

        assert.equal(property.id.toNumber(), propertyCounter);
        assert.equal(property.city, "Viladecans");
        assert.equal(property.price, "150000");
    });
    
    it('property created successfully', async() => {
        const res = await this.Properties.uploadProperty("City false", 0);
        const propertyEvent = res.logs[0].args;

        const propertyCounter = await this.Properties.propertyCounter();

        assert.equal(propertyEvent.id.toNumber(), 2);
        assert.equal(propertyEvent.city, "City false");
        assert.equal(propertyEvent.price, 0);
        assert.equal(propertyEvent.isSelled, false);
    })

    it('property removed successfully', async() => {
        const res = await this.Properties.removeProperty(1);      // id 1 = First property created in constructor
        const propertyEvent = res.logs[0].args;
        const property = await this.Properties.properties(1);

        assert.equal(property.isSelled, true);
        assert.equal(propertyEvent.isSelled, true);
        assert.equal(propertyEvent.id.toNumber(), 1);
        assert.equal(property.id, 1);
    })

    // it('get ETH price', async() => {
    //     const web3 = new Web3.providers.HttpProvider("HTTP://127.0.0.1:7545");
    //     const aggregatorV3InterfaceABI = [{ "inputs": [], "name": "decimals", "outputs": [{ "internalType": "uint8", "name": "", "type": "uint8" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "description", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint80", "name": "_roundId", "type": "uint80" }], "name": "getRoundData", "outputs": [{ "internalType": "uint80", "name": "roundId", "type": "uint80" }, { "internalType": "int256", "name": "answer", "type": "int256" }, { "internalType": "uint256", "name": "startedAt", "type": "uint256" }, { "internalType": "uint256", "name": "updatedAt", "type": "uint256" }, { "internalType": "uint80", "name": "answeredInRound", "type": "uint80" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "latestRoundData", "outputs": [{ "internalType": "uint80", "name": "roundId", "type": "uint80" }, { "internalType": "int256", "name": "answer", "type": "int256" }, { "internalType": "uint256", "name": "startedAt", "type": "uint256" }, { "internalType": "uint256", "name": "updatedAt", "type": "uint256" }, { "internalType": "uint80", "name": "answeredInRound", "type": "uint80" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "version", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }]
    //     const addr = "0x762B7B680D99753b97B41E6e9E22BE66b408C70E"
    //     const priceFeed = new web3.eth.Contract(aggregatorV3InterfaceABI, addr)
    //     priceFeed.methods.latestRoundData().call()
    //         .then((roundData) => {
    //             // Do something with roundData
    //             console.log("Latest Round Data", roundData)
    //         })
    // })
});