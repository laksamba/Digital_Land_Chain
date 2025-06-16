/** @type import('hardhat/config').HardhatUserConfig */
require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();
const { PRIVATE_KEY } = process.env;

module.exports = {
  solidity: "0.8.20",
  networks:{
    sepolia: {
      url: "https://sepolia.infura.io/v3/0669ecc7ed4e49b9abf49c9dd40076cf",
      accounts: [PRIVATE_KEY],
    },
  }
};
