let PropertiesContract = artifacts.require("./Properties");

module.exports = function(deployer){
    deployer.deploy(PropertiesContract);
}