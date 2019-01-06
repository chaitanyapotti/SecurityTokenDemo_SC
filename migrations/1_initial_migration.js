var Migrations = artifacts.require("./Migrations.sol");

module.exports = function(deployer, network, accounts) {
  const operator = accounts[1];
  const alerter = accounts[2];

  console.log(alerter, "alerter");
  console.log(operator, "operator");
  deployer.deploy(Migrations);
};
