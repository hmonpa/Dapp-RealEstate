const sellProperty = artifacts.require('SellProperty');

let instance;

beforeEach(async() => {
    instance = await sellProperty.new()
});

contract('sellProperty', accounts => {
    instance('should have available properties', async() => {
        let total = await instance.totalProperties();
        assert(total > 0);
    });
});