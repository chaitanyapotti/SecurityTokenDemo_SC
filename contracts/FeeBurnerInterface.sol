pragma solidity ^0.4.25;


interface FeeBurnerInterface {
    function handleFees (uint tradeWeiAmount, address reserve, address wallet) external returns(bool);
}
