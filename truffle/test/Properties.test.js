const Properties = artifacts.require('Properties');

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
});