/* global artifacts, web3 */
/* eslint-disable no-unused-vars */
const BN = require("bn.js");
const fs = require("fs");

const Reserve = artifacts.require("./KyberReserve.sol");

const KNC = artifacts.require("./mockTokens/KyberNetworkCrystal.sol");
const OMG = artifacts.require("./mockTokens/OmiseGo.sol");
const MANA = artifacts.require("./mockTokens/Mana.sol");

function tx(result, call) {
  const logs = result.logs.length > 0 ? result.logs[0] : { address: null, event: null };

  console.log();
  console.log(`   Calling ${call}`);
  console.log("   ------------------------");
  console.log(`   > transaction hash: ${result.tx}`);
  console.log(`   > contract address: ${logs.address}`);
  console.log(`   > gas used: ${result.receipt.gasUsed}`);
  console.log(`   > event: ${logs.event}`);
  console.log();
}

module.exports = async (deployer, network, accounts) => {
  const admin = accounts[0];
  const userWallet = accounts[4];

  // Set the instances
  const ReserveInstance = await Reserve.at(Reserve.address);
  const KNCInstance = await KNC.at(KNC.address);
  const OMGInstance = await OMG.at(OMG.address);
  const MANAInstance = await MANA.at(MANA.address);

  // Set token amounts to transfer to user and reserve wallet
  const KNCAmount = new BN(100000).mul(new BN(10).pow(await KNCInstance.decimals())).toString();
  const OMGAmount = new BN(100000).mul(new BN(10).pow(await OMGInstance.decimals())).toString();
  const MANAAmount = new BN(100000).mul(new BN(10).pow(await MANAInstance.decimals())).toString();

  // Transfer tokens to the user
  tx(await KNCInstance.transfer(userWallet, KNCAmount), "transfer()");
  tx(await OMGInstance.transfer(userWallet, OMGAmount), "transfer()");
  tx(await MANAInstance.transfer(userWallet, MANAAmount), "transfer()");

  // Transfer tokens and ETH to the reserve
  tx(await KNCInstance.transfer(Reserve.address, KNCAmount), "transfer()");
  tx(await OMGInstance.transfer(Reserve.address, OMGAmount), "transfer()");
  tx(await ReserveInstance.sendTransaction({ from: admin, value: web3.utils.toWei(new BN(100)) }), "sendTransaction()");
};
