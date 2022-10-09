// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";


/** @modifying the contract to make it more gas efficient
 */

/**WHAT ACTUALLY HAPPENS WHEN WE STORE THESE GLOBAL VARIABLES???
global varibles are stored in what we call storage which can be thoughrt as a big array
each global variable declared takes the next storage slot available in the storage
for dynamic members like array only the length of the is stored..while performing push operation the value which we are pushing are stored in a hashing function the hashing functo=ion is basically used to get the location at which we are stroing number
//mappings do have a storage spot as array but they are just blank

constant variables and immitable varibles do not take any space in storage as they are part of contract bytecode itself
variable inside a function only stays as long as the function exists so they are added in their own memmory datastructure ehich gets deleted after the function is finished

strings are technically dynamic sized arrays and hence we need to specify where we want to store it   memory or storage
*/

/**Any time we read or write from theh storage we spend a lot of gas
whenever we compile a conteract we get an abi and byte code 
byte code is an hex object and we have a opcode for it ..each opcode represents a byte code
opcode represent what the machine code is doing and how much  computational work is actually to do so..gas is actually calculated on the basis of thesse opcodes

store to memory and load from memory has the higest gas cost
 */








 
//  instead of copy pasting the whole interface as shown below we cn directly import it from gitHub and npm package
// @chainlink/contracts refer to npm package

// interface AggregatorV3Interface {
//   function decimals() external view returns (uint8);

//   function description() external view returns (string memory);

//   function version() external view returns (uint256);

//   function getRoundData(uint80 _roundId)
//     external
//     view
//     returns (
//       uint80 roundId,
//       int256 answer,
//       uint256 startedAt,
//       uint256 updatedAt,
//       uint80 answeredInRound
//     );

//   function latestRoundData()
//     external
//     view
//     returns (
//       uint80 roundId,
//       int256 answer,
//       uint256 startedAt,
//       uint256 updatedAt,
//       uint80 answeredInRound
//     );
// }


// get fund ffronm user;
// set a minium fund limit in usd
// withdraw funds;
import 'contracts/PriceConverter.sol';


// error codes
// error Fundme__notOwner;



contract Fundme{
    using PriceConverter for uint256;
    // contract adressses can ghold fund asa wallet can
    // to know hw much value  someone is sending we use msg.value;
    
    uint256 public miniumUSD=50*1e18;
    address private owner;

// constructor is a function that gets immediatly a called when a function is deployed
// while ther function are created not called when we deploy ..we have to call them separately after deployment and if thery are not pure or view we transact them
// here using constructor for initialisation we aare not required call the transaction many times;



// refactorin gour codxefor mocking purposes
// in the constructor we can actually pass thepricecfeedaddress as a parameter
// as the pricefeed is now a parameterwe can change it as weswitch networks

AggregatorV3Interface private pricefeed;
constructor(address priceFeedAddress){
owner=msg.sender;
pricefeed= AggregatorV3Interface(priceFeedAddress);
}


/* as we parameterize th epricefeed now we can pass it to functions similarly as 
asw are using a library priceconverter on uint ..we can pass price feed as aparameter as well to therese library fuction like to
getConversionRate()*/




// array to keep atrack of all those sending ney to the smart contract
mapping(address=>uint) private addressToMoney;

address[] private funders  ;
function fund() public payable{
     require(msg.value.getConvertCurrency(pricefeed)>= miniumUSD,"Not sufficient funds send");
     funders.push(msg.sender);
     addressToMoney[msg.sender]=msg.value;
    
    //  require staement reverts a transaction 
    // reverting means undo any action done before and send the remaing gas back
    // gas will bespent but unsed gas will be reverted bsck to the account

    // now we need to conver tour ether toreal world currency si=o that they are actually applicable to the real world
}




// MODIFIERS
// require(msg.sender==owner,"Only owner can withdraw");
// SUPPOSE we need this require condition checkin many function then we have to copy paste it many times
// instead we usee modifiers;
// so inside the modifier we set the functionality and add the modifier name at the end of function name;
// _; implies first execute the require statement and then rest of the code inside the function on which it has been applied;
// hence by applying mdifiers we change the functionalitiesof the function

modifier onlyOwner{
  require(msg.sender==owner,"Only owner can withdraw");
  _;
}


function withdraw()public onlyOwner{
require(msg.sender==owner,"Only owner can withdraw");
// updating the mapping of funder
address withDrawingFunder= msg.sender;

for(uint256 funderNum=0;funderNum < funders.length;funderNum++){

    addressToMoney[withDrawingFunder]=0;
}
// resetting the funders array
// in parenthesise we put the no of values with which wee want to initialise our array with
// here it is 0 as we are initialising a blank array
funders= new address[](0);

// 3 WAYS TO ACEESS BALANCE FROM A CONTRACT
// transfer
// call
// send

// retreiving balance from a contract using this;
// payable(msg.sender).transfer(address(this).balance);
// this refers to address of this entire contract
// disadvantages==> transfer function is cappedd at 2300 gas and if more gas is used it throws an error;
// if more gas  is used it throws an error; and revert the transaction


// using send==> it is also capped at 2300 gas but will not throw an eror instead will return a bool
  bool isSuccess=payable(msg.sender).send(address(this).balance);
  require( isSuccess,"Transaction not sent");
// hereas the transaction will not revert we will add the failure condition for send


// usibg call
// it is very powerful tool and is lower level function
// we can use it to call any ethrium function on blockChain without even needing its abi;
// here we atre using it for transcation and hem ce acan pass this.balance
// ehen a function returns two parameters we can get it as shown
//  it retrurns a bool and bytes data array to store the values returned by functions callled by it
// bool is true if the function as successfully called
// since we are not calling any function we use ""
// (bool callSuccess, byts memory datareturned)= payable(msg.sender).call{value:address(this).balance}("");
(bool callSuccess,)= payable(msg.sender).call{value:address(this).balance}("");
  require( callSuccess,"Transaction not sent");






}
/*withdraw(); function is very costly and hence we will try to make it gas efficient



*/
// 
function cheapWithdraw() public payable onlyOwner{
  /**instead of constantly reading from storage we can read it to memmory one time and then from memmory update the array*/
  address[] memory m_funders= funders;
  //note : mappings cannot be in memmory 
  //now we read and write from the memmory varible once we are done and then finally update the storage variable
  for(uint256 funderNum=0;funderNum < m_funders.length;funderNum++){
     //getting each address
    address funder = m_funders[funderNum];
    addressToMoney[funder]=0;//resetting our funders mapping to 0 sothat each accounts balance is updated to 0
}
funders= new address[](0);
(bool Success,)= payable(msg.sender).call{value:address(this).balance}("");
  require( Success,"Transaction not sent");


}


function getPriceFeed() public returns(AggregatorV3Interface){
  return pricefeed;



}











// INSTEAD OF AGAIN EXPLICITLY CREATING THESE FUNCTIONS WE WILL BE IMPORTING THE LIBRARY WE CRATED


//  function getPrice()public view returns (uint){
//      AggregatorV3Interface pricefeed= AggregatorV3Interface(0x8A753747A1Fa494EC906cE90E9f37563A8AF630e);
//      (,int price,,,)=pricefeed.latestRoundData();
//     //  adjusting the decimal plaves with ether;
//      return uint(price*1e10);


// //    here will be importing the chainlink smart contract to get our usd price  but to do so we need
// // ABI:is just info abouut the set of functions and methhods we can called to use etherium
// // we can get abi by importing the whole contract but in that case we may unnecessaryly import lot of code 
// // hence we use interface knowing what function of te contract we can interct with


// // address of the contact ==> obained from chainLInk io;0x8A753747A1Fa494EC906cE90E9f37563A8AF630e

//  }
// // we dont use decimals in solidity so that we dont loose the precision

// // fiunction to convert usd to ether{

//     function getConvertCurrency(uint _usdAmount) public view returns(uint ){
//         uint etherPrice=getPrice();
//         uint convertedToEther= (_usdAmount*etherPrice)/1e18;
//         return convertedToEther;



//     }



// function getVersion()public view returns (uint256){
// // hence we can interact with the contract sthat exist outside our project using interfaces which gets compiled down to abi and we combine it with address to caall a function
// AggregatorV3Interface pricefeed= AggregatorV3Interface(0x8A753747A1Fa494EC906cE90E9f37563A8AF630e);
// return pricefeed.version();
// // it returns the version of the smart contract}

// }


/**we are making some of the storage varible private and then access there values using a getter function

 */
function getOwner () public view returns (address){
  return owner;

}

function getFunders (uint256 _i) public view returns (address){
  return funders[_i] ;
}

function getAddresToMoney ( address _a) public view returns (uint256){
  return addressToMoney[_a] ;
}

}