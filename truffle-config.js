 const path = require("path");
require('dotenv').config();
const HDWalletProvider = require("truffle-hdwallet-provider");
module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  contracts_build_directory: path.join(__dirname, "client/src/contracts"),
  networks: {
    development: {
      host: "localhost",
      port: 7545,
      network_id: "5777"
    },
    ropsten: {
     // host: "127.0.0.1",
     // port: 8545,
provider: () => new HDWalletProvider(process.env.TEST_MNEMONIC, "https://ropsten.infura.io/v3/279c40b247e246609188d276e02e6de2", 0),
network_id: 3,
      gas: 4700000,
    //  from: "0x7fC348b217b1F02fBa88e7b5096C9eA5D9C6E8A0"
    },
    rinkeby: {
      host: "127.0.0.1",
      port: 8545,
      network_id: 4,
      gas: 4700000,
      from: "0x6a1335bcc64630802a3edfbcdfea84de45608b27"
    }
  }
};

/*require('dotenv').config();
const HDWalletProvider = require("truffle-hdwallet-provider");

module.exports = {
contracts_build_directory: path.join(__dirname, "client/src/contracts"),
        networks: {
                development: {
                        host: "127.0.0.1",
                        port: 8545,
                        network_id: "*"
                },
                "ropsten-infura": {
                        provider: () => new HDWalletProvider(process.env.TEST_MNEMONIC, "https://ropsten.infura.io/"+process.env.INFURA_KEY, 0),
                        network_id: 3,
                        gas: 4700000,
                        gasPrice: 100000000000
                }
        }
};*/

