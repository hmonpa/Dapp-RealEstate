var Properties      = artifacts.require('../contracts/Properties.sol');
var Auth            = artifacts.require('../contracts/Auth.sol');
// var PriceConverter  = artifacts.require('../contracts/PriceConverter.sol');

module.exports = function(deployer){
  deployer.deploy(Properties);
  deployer.deploy(Auth);
  // deployer.deploy(PriceConverter);
}