require("dotenv").config();
require("@nomiclabs/hardhat-waffle");
const infuraProjectId = process.env.INFURA_PROJECT_ID;
const keyData = process.env.PRIVATE_KEY;

module.exports = {
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      chainId: 1337, // config standard
    },
    mumbai: {
      url: `https://polygon-mumbai.infura.io/v3/${infuraProjectId}`,
      accounts: [keyData],
    },
    mainnet: {
      url: `https://polygon-mainnet.infura.io/v3/${infuraProjectId}`,
      accounts: [keyData],
    },
  },
  solidity: {
    version: "0.8.4",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
};
