/* global artifacts, web3 */
/* eslint-disable no-underscore-dangle, no-unused-vars */
const BN = require("bn.js");
const moment = require("moment");
const increaseTime = require("./increaseTime");

const ManaToken = artifacts.require("./Mana.sol");
const NetworkProxy = artifacts.require("./KyberNetworkProxy.sol");

function stdlog(input) {
  console.log(`${moment().format("YYYY-MM-DD HH:mm:ss.SSS")}] ${input}`);
}

function tx(result, call) {
  const logs = result.logs.length > 0 ? result.logs[0] : { address: null, event: null };

  console.log();
  console.log(`   ${call}`);
  console.log("   ------------------------");
  console.log(`   > transaction hash: ${result.tx}`);
  console.log(`   > contract address: ${logs.address}`);
  console.log(`   > gas used: ${result.receipt.gasUsed}`);
  console.log(`   > event: ${logs.event}`);
  console.log();
}

module.exports = async callback => {
  try {
    stdlog("- START -");
    let expectedRate;
    let slippageRate;
    const ETH_ADDRESS = "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee";
    const accounts = await web3.eth.getAccounts();
    const userWallet = accounts[4];
    const MANAInstance = await ManaToken.at(ManaToken.address);
    const NetworkProxyInstance = await NetworkProxy.at(NetworkProxy.address);

    const userDaiBalance = web3.utils.fromWei(await MANAInstance.balanceOf(userWallet));
    console.log("User MANA balance: ", userDaiBalance, " MANA");

    // Approve the KyberNetwork contract to spend user's tokens
    await MANAInstance.approve(NetworkProxy.address, web3.utils.toWei(new BN(100000)), { from: userWallet });
    ({ expectedRate, slippageRate } = await NetworkProxyInstance.getExpectedRate(
      ManaToken.address, // srcToken
      ETH_ADDRESS, // destToken
      web3.utils.toWei(new BN(200)) // srcQty
    ));
    console.log("Received expected rate : ", web3.utils.fromWei(expectedRate));

    const result = await NetworkProxyInstance.swapTokenToEther(
      ManaToken.address, // srcToken
      web3.utils.toWei(new BN(200)), // srcAmount
      expectedRate, // minConversionRate
      { from: userWallet }
    );
    tx(result, "DAI <-> ETH swapTokenToEther()");

    // for (let index = 0; index < 35; index++) {
    //   const result = await NetworkProxyInstance.swapTokenToEther(
    //     DaiToken.address, // srcToken
    //     web3.utils.toWei(new BN(200)), // srcAmount
    //     expectedRate, // minConversionRate
    //     { from: userWallet }
    //   );
    //   tx(result, "DAI <-> ETH swapTokenToEther()");
    // }

    const userDaiBalanceFinal = web3.utils.fromWei(await MANAInstance.balanceOf(userWallet));
    console.log("User MANA balance: ", userDaiBalanceFinal, " MANA");

    stdlog("- END -");
    callback();
  } catch (error) {
    callback(error);
  }
};
