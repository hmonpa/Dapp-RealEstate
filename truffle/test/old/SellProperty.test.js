// const sellProperty = artifacts.require('SellProperty');

// let instance;

// beforeEach(async() => {
//     instance = await sellProperty.new()
// });

// contract('sellProperty', accounts => {
//     it('should have available properties', async() => {
//         let total = await instance.totalProperties();
//         assert(total > 0);
//     });

//     it ('should allow buyers to buy a property providing its value', async() => {
//         let property = await instance.properties(0);
//         let propertyName = property[0], price = property[1];    // Name = Value 0 of the array / Price = Value 1 of the array
//         //console.log(property);

//         await instance.buyProperty(0, { from: accounts[0], value: price });

//         // Llamada al mapping buyerProperties (1st param address, 2nd param mapping index)
//         let buyerProperty = await instance.buyerProperties(accounts[0], 0);
//         let buyerTotalProperties = await instance.buyerTotalProperties(accounts[0]);
//         console.log(buyerProperty, buyerTotalProperties);
//     });
// });