var Properties = artifacts.require('../contracts/Properties.sol');
var Auth = artifacts.require('../contracts/Auth.sol');

module.exports = function(deployer){
  deployer.deploy(Properties);
  deployer.deploy(Auth);
}