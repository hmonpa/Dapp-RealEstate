var Properties = artifacts.require('../contracts/Properties.sol');
var Auth = artifacts.require('../contracts/Auth.sol');
// var PriceToEther = artifacts.require('../contracts/PriceToEther.sol');

module.exports = function(deployer){
  deployer.deploy(Properties);
  deployer.deploy(Auth);
  // deployer.deploy(PriceToEther);
}