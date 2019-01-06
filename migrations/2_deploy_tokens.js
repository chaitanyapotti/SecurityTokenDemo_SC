/* global artifacts */
const KNC = artifacts.require("./mockTokens/KyberNetworkCrystal.sol");
const OMG = artifacts.require("./mockTokens/OmiseGo.sol");
// const MANA = artifacts.require("./mockTokens/Mana.sol");
const SALT = artifacts.require("./mockTokens/Salt.sol");

module.exports = async deployer => {
  // Deploy the tokens
  await deployer.deploy(KNC);
  await deployer.deploy(OMG);
  // await deployer.deploy(MANA);
  await deployer.deploy(SALT);
};
