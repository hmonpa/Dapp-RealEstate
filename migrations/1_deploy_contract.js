var Properties = artifacts.require('../contracts/Properties.sol');

module.exports = function(deployer){
  deployer.deploy(Properties);
}