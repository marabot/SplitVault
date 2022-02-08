const path = require("path");
require('dotenv').config();
const HDWalletProvider = require('@truffle/hdwallet-provider');




module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  networks: {
    fuji:{
      provider: ()=> new HDWalletProvider(
        process.env.PRIVATE_KEY,
        process.env.INFURA_URL
         
      ),
        gas: 7000000,
        gasPrice: 470000000000,
        network_id:"*",
        skipDryRun: true
    },


    development: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "*" // Match any network id
    }
  },

  contracts_build_directory: path.join(__dirname, "client/src/contracts"),
  compilers: {
    solc: {
      version: '0.8.0',
      optimizer: {
        enabled: true,
        runs: 1
      }
    }
  }
};
