/* global artifacts */
/* eslint-disable no-unused-vars */
const Network = artifacts.require("./KyberNetwork.sol");
const ConversionRates = artifacts.require("./ConversionRates.sol");
const SanityRates = artifacts.require("./SanityRates.sol");
const Reserve = artifacts.require("./KyberReserve.sol");
// const AutomatedReserve = artifacts.require("./KyberAutomatedReserve.sol");
const FeeBurner = artifacts.require("./FeeBurner.sol");
const ExpectedRate = artifacts.require("./ExpectedRate.sol");

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
  const operator = accounts[1];
  const alerter = accounts[2];

  console.log(alerter, "alerter");
  console.log(operator, "operator");
  // Set the instances
  const NetworkInstance = await Network.at(Network.address);
  const ConversionRatesInstance = await ConversionRates.at(ConversionRates.address);
  const SanityRatesInstance = await SanityRates.at(SanityRates.address);
  const ReserveInstance = await Reserve.at(Reserve.address);
  // const AutomatedReserveInstance = await AutomatedReserve.at(AutomatedReserve.address);
  const FeeBurnerInstance = await FeeBurner.at(FeeBurner.address);
  const ExpectedRateInstance = await ExpectedRate.at(ExpectedRate.address);

  // Set permissions of contracts
  tx(await NetworkInstance.addOperator(operator, { gas: "300000", from: accounts[0] }), "addOperator()");
  tx(await ConversionRatesInstance.addOperator(operator, { gas: "300000", from: accounts[0] }), "addOperator()");
  tx(await ReserveInstance.addOperator(operator, { gas: "300000", from: accounts[0] }), "addOperator()");
  tx(await ReserveInstance.addAlerter(alerter, { gas: "300000", from: accounts[0] }), "addAlerter()");
  // tx(await AutomatedReserveInstance.addOperator(operator), "addOperator()");
  // tx(await AutomatedReserveInstance.addAlerter(alerter), "addAlerter()");
  tx(await FeeBurnerInstance.addOperator(operator, { gas: "300000", from: accounts[0] }), "addOperator()");
  tx(await ExpectedRateInstance.addOperator(operator, { gas: "300000", from: accounts[0] }), "addOperator()");
  tx(await SanityRatesInstance.addOperator(operator, { gas: "300000", from: accounts[0] }), "addOperator()");
};
