const networkConfig={
4:{

    name: "rinkeby",
    ethUsdPricefeed:""
},
137:{
    name:"polygon",
    ethUsdPriceFeed:"0xF9680D99D6C9589e2a93a78A04A279e509205945"
},
5:{

    name:'goerli',
    ethUsdPriceFeed:"0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e"

},
43114:{
    name:"avalanche",
    ethUsdPriceFeed:"0x976B3D034E162d8bD72D6b9C989d545b839003b0"

}
}

const devChains=["hardhat","localhost"]
const DECIMALS=8
const PAYMENT_AMOUNT =2000000000;
const _timeout=10
const _minSubmissionValue=1000000000
const  _maxSubmissionValue=100000000000
const _description="my fund me contract"
const  _link="0xD258f3f92C5dcD0AA69cB572c1705aBbCf1231f4"
const _validator="0xD258f3f92C5dcD0AA69cB572c1705aBbCf1231f4"


module.exports={
    networkConfig,
    devChains,
    DECIMALS,
 PAYMENT_AMOUNT,
 _timeout,
 _minSubmissionValue,
  _maxSubmissionValue,
 _description,
  _link,
}