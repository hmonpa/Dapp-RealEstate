let SellProperty = artifacts.require("./SellProperty.sol");

module.exports = function(deployer){
    deployer.deploy(SellProperty);
}