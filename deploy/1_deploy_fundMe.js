// here will not  have anymain function indtr=ead we will be a=having an anoynonous function 
// here hardhat deploy wil only be calling the function e=we deploy in the scripts
// we will export thet function as modules ,exports
// hre is passed as a paraemeter to this funciton

const { getNamedAccounts, deployments, network, run } = require("hardhat");


const {networkConfig,devChains} = require("../helper-hardhat-config")
// const { deploy, log } = deployments
 // const { deployer } = await getNamedAccounts()
const {  verify}=require("../utils/verify")

// we are changing it to let variabe so that we can actually update







// we modularized our code sothat when we ae switching from  one e=netwoek to other it is easier
// but our local host is not a live network so how do we actually get the pricrfeed address for it
// if contract  on which our contact relies doesnot exist deploy a locsl version of our smatrt contract for testing locally

// deploy mock is technivcally a deploy scripts







//next we will pull out the variables and function use din hre
//  hardhat deploy automatically calls the functon and [ases the hre object into it


// module.exports=async(hre)=>{
//  const{getNamedAccounts, deployments}= hre
// }




/**
 * 
 * function getVersion() internal view returns (uint256){
// hence we can interact with the contract sthat exist outside our project using interfaces which gets compiled down to abi and we combine it with address to caall a function
AggregatorV3Interface pricefeed= AggregatorV3Interface(0x8A753747A1Fa494EC906cE90E9f37563A8AF630e);
return pricefeed.version();
// it returns the version of the smart contract}}

here we are passing hardcode address  to genera te an instance of AggregatorV3Interface but this
adddress is valid for only rinkeby testnet
but what is we want to run it on hardhat network
~hardhat is a blank blockchain and it get s destroyed everytime the scripts finishes
so whwn we working n its local node the pricefeed cntract wont exist

so how to make it work on local block chain

==>SOLUTION MOCKING=.USED FOR UNIT TESTING
an object(in our case contract ) may have dependencie son other complex objects..and hence to islatethe behaviour of the object we want to
replace the other object by the mocks that simulates the behaviour of that object


we want t make a local copy of  AggregatorV3Interfacewhich wecan control locally

 when going for local host or hardhat we wan t to use a mock
// what will happen when we try to change the chains
// for example the price feed contract will have different address on differntchain ;\like etherium, polygon
// so m=we need to mmodularise or [arameterix=ze the addressing so that no matter what chain we use our contract is gonna work





 */














// the abve syntx is just as same as the below syntax
module.exports= async({getNamedAccounts, deployments})=>{
  // we are using th edeployments bject to get 2 functions // 
  const{deploy,log}=deployments;
//   pulling hte deployer function from get named accounts
// getNamedAccounts()==> way for us to get named accounts
// bassically only using private key to get our accounts a=can be a little bit com=nfusing and hence we 
// can use get named accounts to identify each accunt with a 
// declaration of named accounts can be found in haedhatconfig.js file
  const {deployer}= await getNamedAccounts()
  const chainId= network.config.chainId

  

  let ethPricefeedAddress

  /**here network is hardhat and hence we are checking the array of networks contains the name of hardhat network if so the deploy mock contract or else just deploy the pricefeed contract provided for the given chain id*/
  if(devChains.includes(network.name)){

    console.log("Local network detected ....Deploying mocks..")

    const EthUsdAggregator= await deployments.get("MockV3Aggregator")//get commands usd to get the details of most recent transtion

    ethPricefeedAddress= EthUsdAggregator.address
    console.log("__________________________________________________________________________________________________________________________________")

// actually begin to deploy contract
// we pass variety of arument to the deploy function
// also we are passing the account address of deployer as the addresss to which we wiol deploy smart contract
// here we are not using contractfactory but just the function deploy 

  }else {

    ethPricefeedAddress= networkConfig[chainId]["ethUsdPriceFeed"];
  console.log("}logged")

 console.log("_______________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________")

  }



/**here we will be using aave protocol and hence use the chia id to deployour smartcontract
 * using netwiork config we can get different variables for different addresses
 * 
 */






   
   
// when going for local host or hardhat we wan t to use a mock
// what will happen when we try to change the chains
// for example the price feed contract will have different address on differntchain ;\like etherium, polygon
// so m=we need to mmodularise or [arameterix=ze the addressing so that no matter what chain we use our contract is gonna work
const args =[ethPricefeedAddress ]
const Fundme = await deploy("Fundme",{
  // contract:"Fundme",
  from:deployer,
  args:args ,//=>pass the array of constructir argumrnts
  log:true,//spit out the transaction details
  withConfirmation:network.config.blockConfirmation ||1

})


// note  every time we are running a local node on hardhat all our deploy scripts will be packed with it automatically



//addings some more utilities for verification
   //note we only will verify if the network is not our local network that is a live network
  //  WE MAKE A SEPERATE VERIFY FOLDER AND ADD THE CODE HERE
    if (!devChains.includes(network.name) && process.env.ETHER_SCAN_API ){
       await verify(Fundme.address, args)
    }







   }






   



   module.exports.tags=["all","Fundme"]