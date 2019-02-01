# smart-contracts

Smart Contracts for Two12 Liquidity Network

Global installations required:
truffle ^5.0.0: `npm i -g truffle`
ganache: https://github.com/trufflesuite/ganache/releases/v1.3.0

For installation,
`yarn`

To run test cases
`yarn run test`

To run scripts
Ensure ganache is running locally
`truffle compile --all`

`truffle migrate --network development --reset`

`truffle exec ./scripts/1_trade.js --network development`
