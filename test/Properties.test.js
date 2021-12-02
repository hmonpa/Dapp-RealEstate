const Properties = artifacts.require('Properties');
const { assert } = require("chai");

contract('Properties', () => {
    before(async() => {
        this.Properties = await Properties.deployed();
    });

    it('Properties contract deployed successfully', async() => {
        const address = this.Properties.address;

        assert.notEqual(address, null);
        assert.notEqual(address, undefined);
        assert.notEqual(address, 0x0);
        assert.notEqual(address, "");
    });

    it('get properties list', async() => {
        const propertyCounter = await this.Properties.propertyCounter();
        const propertyCounterNum = propertyCounter.toNumber();
        assert.equal(propertyCounterNum, 1);
        
        const property = await this.Properties.properties(propertyCounterNum-1);

        assert.equal(property.city, "Viladecans");
        assert.equal(property.price, "150000");
    });

    it('get owner from property index', async() => {
        const ownerAddr = await this.Properties.getPropertyFromIndex(0);
        assert.notEqual(ownerAddr, "0x0");
    });

    it('get property from owner', async() => {
        await this.Properties.uploadProperty("City example 1", 0);
        const indexesMatch = await this.Properties.getPropertiesFromOwner('0xc43cb2fF3FC1A6f3f8B785659b71687350562335');
        let indexesString = indexesMatch.toString();
        let indexes = indexesString.split(',');
    });
    
    it('property created successfully', async() => {
        const res = await this.Properties.uploadProperty("City example 2", 0);
        const propertyEvent = res.logs[0].args;

        const propertyCounter = await this.Properties.propertyCounter();

        assert.equal(propertyEvent.city, "City example 2");
        assert.equal(propertyEvent.price, 0);
        assert.equal(propertyEvent.isSold, false);
    });

    it('property removed successfully', async() => {
        const newProperty   = await this.Properties.uploadProperty("Town", 100000);
        const resNewProp    = newProperty.logs[0].args;
        const newPropAddr   = await this.Properties.getPropertiesFromOwner(resNewProp.owner);

        const res = await this.Properties.removeProperty(newPropAddr);      
        const propertyEvent = res.logs[0].args;
        const property = await this.Properties.properties(newPropAddr);

        assert.equal(property.isSold, true);
        assert.equal(propertyEvent.isSold, true);

        
        // assert.equal(propertyEvent.index, 1);
        // assert.equal(property.id, 1);
    });

});