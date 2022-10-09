require("@nomicfoundation/hardhat-toolbox");
require('hardhat-deploy')
require('dotenv').config()
// we need to install the chainlink library uinng npm~
// in the deploy folder e are writing our scripts
// earlier we are using harhat ethers t deply and iinteractc with our smart contract and now 
// over riding it withh hardhat deploy ethers
// hardhat deploy oveharDrwrites hardhat which over writes ethers
// HARDHAT ETHERS PACKAGE IS OVERWRITTEN BY HARDHAT ETERS .JS PACKAGE ]
/** @type import('hardhat/config').HardhatUserConfig */
// when we run hae=rdhat deploy all the scripts in our deploy folder gets run
// we numebr them to specify the order in which we want to run them
   
ETHER_SCAN_API=process.env.ETHER_SCAN_API
GOERLI_API=process.env.GOERLI_RPC_URL
PRIVATE_KEY=process.env.PRIVATE_KEY


module.exports = {
  solidity: {
    compilers:[
      {version:"0.8.0"},
      {version:"0.6.6"}
    ]
  },
  defaultNetwork:"hardhat",
  networks:{
    
 ropsten:{
  url:"",
  accounts:[]//=>HERE INSTEAD OF PASSING DIFFERENT PRIVATE KEYS WE ARE USINFG NAMED ACCOUNTS FT ACTUALLY IDENTIFY OUR ACCOUNTS
 },
 goerli:{
url:GOERLI_API,
accounts:[PRIVATE_KEY],
chainId:5,
blockConfirmation:6
    

 }


  },
  namedAccounts:{
    deployer:{
      default:0,//=> here we are saying that the 0th account will be named deployer
     // we can specify which number wll be the deploer across different chains// 
     //eg 4:1==> at rinkeby we want that the acouut at index 1 to bethe deployer

    },//we can also create mutiusers
    users:{
      default:1
    },
    



  },
gasReporters:{

enabled: true,
outputFile:"gasReport.txt",
noColors: true,
},


  etherscan:{
    apiKey:{
     goerli: ETHER_SCAN_API,
    }

 }
};
