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
        const property = await this.Properties.properties(propertyCounter-1);

        assert.equal(property.id, propertyCounter-1);
    });
});