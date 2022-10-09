//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// here we have to downlod hte npm of chain link oracle packad=ge in order to use it 
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
library PriceConverter{

// libraries can be used to a large extent to consolidate our code..
// we will be exporting this library to our smart contract
// we can apply library functions to any of our predefined data types or user defined data types
// eg using PriceConverter for uint ====> we are applying the library functions to uint;
// so now we can trat uint as an object and then use these function as methods of the function
//  eg msg.sender.getConversionRate()






   
    
function getPrice( AggregatorV3Interface pricefeed)internal view returns (uint){
    // no longer 
    //  AggregatorV3Interface pricefeed= AggregatorV3Interface(0x8A753747A1Fa494EC906cE90E9f37563A8AF630e);
     (,int price,,,)=pricefeed.latestRoundData();
    //  adjusting the decimal plaves with ether;
     return uint(price*1e10);


//    here will be importing the chainlink smart contract to get our usd price  but to do so we need
// ABI:is just info abouut the set of functions and methhods we can called to use etherium
// we can get abi by importing the whole contract but in that case we may unnecessaryly import lot of code 
// hence we use interface knowing what function of te contract we can interct with


// address of the contact ==> obained from chainLInk io;0x8A753747A1Fa494EC906cE90E9f37563A8AF630e

 }
// we dont use decimals in solidity so that we dont loose the precision

// fiunction to convert usd to ether{

    function getConvertCurrency(uint _usdAmount, AggregatorV3Interface priceFeed) internal view returns(uint ){
        uint etherPrice=getPrice(priceFeed);
        uint convertedToEther= (_usdAmount*etherPrice)/1e18;
        return convertedToEther;



    }   



function getVersion(AggregatorV3Interface priceFeed) internal view returns (uint256){
// hence we can interact with the contract sthat exist outside our project using interfaces which gets compiled down to abi and we combine it with address to caall a function
// AggregatorV3Interface pricefeed= AggregatorV3Interface(0x8A753747A1Fa494EC906cE90E9f37563A8AF630e);
return priceFeed.version();
// it returns the version of the smart contract}

}






    
}