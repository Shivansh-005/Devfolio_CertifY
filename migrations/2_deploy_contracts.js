var Authenticity = artifacts.require("./Authenticity.sol");

module.exports = function(deployer) {
  deployer.deploy(Authenticity);
};
