require("@nomiclabs/hardhat-waffle");
require('dotenv').config();
const fs = require('fs');
module.exports = {
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      chainId: 1337
    },
    mumbai: {
      url: `https://speedy-nodes-nyc.moralis.io/${process.env.moralisId}/polygon/mumbai`,
      accounts: [process.env.privateKey]
    },
    /*
    matic: {
      // Infura
      // url: `https://polygon-mainnet.infura.io/v3/${infuraId}`,
      url: "https://rpc-mainnet.maticvigil.com",
      accounts: [process.env.privateKey]
    }
    */
  },
  solidity: {
    version: "0.8.4",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  }
};

