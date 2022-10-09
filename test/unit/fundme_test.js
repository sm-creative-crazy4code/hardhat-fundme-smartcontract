// unit section is used to test small section of our code

//const { getStorageAt } = require("@nomicfoundation/hardhat-network-helpers")
const { assert, expect } = require("chai")
const {deployments,ethers,getNamedAccounts}=require("hardhat")


describe("Fundme", async function(){

let fundme
let deployer
const sendValue= ethers.utils.parseEther("1")//=>equals to the value of 1 ethers


/**here before testing our contract we will have to deploy it using the hardhat*/
beforeEach(async function(){
// for doing so we have to first get the deploying account using the named accounts
deployer= await (getNamedAccounts()).deployer//==>this gives some fake accounts to begin with

/*** onther method to get fake signing accounts
 * const accounts = await ethers.getSigners()=> gives a list of 10 fake accounts
 * 

*/

// when deploying on local network we need our mocks contract to also get deployed but doing so separately is tideous
await deployments.fixture(["all"])//=>this enables us to deploy all those contracts at once that have all module tag associated with them

// hardhat deploy wraps the ethers package with getcontract function===>it gives the deployment of most recent contract we pass the name of
fundme = await ethers.getContract("Fundme",deployer)
mockAggregatorV3= await ethers.getContract("MockV3Aggregator",deployer)



})

// 
// testing the constructor

describe("constructor", async function(){
it("sets the pricefeed address as per network",async function(){
// the constructor actuallly sets the pricefeed adderess as per network
// since here we are deploying to our local network we must check that the pricefeed address is actually same as that our mock feed address
// here we are doing so

const response = await fundme.pricefeed
assert.equal( response,mockAggregatorV3.address)


})




})



describe("fund",async function(){

    it("fails when required amount of eth are not send",async function(){

 await expect(fundme.fund()).to.be.revertedWith("Not sufficient funds send") })


 it("updates the  address and money datastructure mapping", async function(){
    await fundme.fund({value:sendValue})

    // in the contract we are having an mapping of address to uint of money against the asddress of the funder to the amount he sends
    // hence we will just check whether against the corresponding address we are having the amount we are sending or not
    const response= await fundme.addressToMoney(deployer)
    assert.equal(response.toString(),sendValue.toString())
 })
 it("pushes the addresses to the funders array")
 await fundme.fund({value:sendValue})
 const response= await fundme.funders(0)
 assert.equal(response,deployer)


})

describe("withdraw", async function(){
    //Now before each test in withdraw section we actually want our contract to have some money
    // hence before each test we may send some money to our smart contract
beforeEach(async function(){
    await fundme.fund({value:sendValue})
    // before every function in the withdraw scope we will fund our contract

})
it("should withdraw ETH from the funding contract", async function(){
    //checking the initial balance of the contract and that of the deployer 
    const startingContractBalance= await fundme.provider.getBalance(fundme.address)
    const startingDeployerBalance= await fundme.provider.getBalance(deployer)

   // calling the withdraw function
    const transactionResponse= await fundme.withdraw()
    const transactionReceipt= await transactionResponse.wait(1)

     //gas cost calculation
     const {gasUsed, effectiveGasPrice} = transactionReceipt
     const gasCost=gasUsed.mul(effectiveGasPrice).toString()

   // getting the contract and deployer balance after withdraw
    const endingContractBalance= await fundme.provider.getBalance(fundme.address)
    const endingDeployerBalance= await fundme.provider.getBalance(deployer)

   // as we had withdrawn all the balance the contract balance musts be 0 and the deployer balance must be equal to the contract balance plus  the initial deployer balance minus the gas cost
    assert.equal(endingContractBalance.toString(),0)
    assert.equal(
    startingContractBalance.add(startingDeployerBalance).toString(),
    endingDeployerBalance.add(gasCost).toString()
    )
})

it("should receive transaction from multiple accounts",async function(){

// getting the accounts
const accounts = await ethers.getSigners()
// receiving funds from multiple accounts
// lopping through all addresses and connecting each of them with the contract
for(let i=0;i<6;i++){
const connectedContract= fundme.connect(accounts[i].address)
await connectedContract.fund({value:sendValue})//sending ethers via the connected accounnts to the contract
}

//checking the initial balance of the contract and that of the deployer 
const startingContractBalance= await fundme.provider.getBalance(fundme.address)
const startingDeployerBalance= await fundme.provider.getBalance(deployer)

 // calling the withdraw function
 const transactionResponse= await fundme.withdraw()
 const transactionReceipt= await transactionResponse.wait(1)


 //getting the contract and deployer balance after withdraw
 const endingContractBalance= await fundme.provider.getBalance(fundme.address)
 const endingDeployerBalance= await fundme.provider.getBalance(deployer)


//assertions and expections
// as we had withdrawn all the balance the contract balance musts be 0 and the deployer balance must be equal to the contract balance plus tfhe initial deployer balance minus the gas cost
assert.equal(endingContractBalance.toString(),0)
assert.equal(
startingContractBalance.add(startingDeployerBalance).toString(),
endingDeployerBalance.add(gasCost).toString()
)
// checking if the funders array is resert properly
await expect(fundme.funders(0)).to.be.reverted

// making sure the mapping is updated properly to 0 after 
for(let i=0;i<6;i++){
    assert.equal( await fundme.addressToMoney(accounts[i].address,0))
}
})
it("allows only owner to withdraw money",async function(){
    const accounts = await ethers.getSigners()
    const attacker =accounts[1]
    const connectedAccounts= await fundme.connect(attacker.address)
    await expect(connectedAccounts.withdraw()).to.be.reverted
})



})

describe("cheaper withdraw testing..", async function(){
    //Now before each test in withdraw section we actually want our contract to have some money
    // hence before each test we may send some money to our smart contract
beforeEach(async function(){
    await fundme.fund({value:sendValue})
    // before every function in the withdraw scope we will fund our contract

})
it("should withdraw ETH from the funding contract", async function(){
    //checking the initial balance of the contract and that of the deployer 
    const startingContractBalance= await fundme.provider.getBalance(fundme.address)
    const startingDeployerBalance= await fundme.provider.getBalance(deployer)

   // calling the withdraw function
    const transactionResponse= await fundme.cheapWithdraw()
    const transactionReceipt= await transactionResponse.wait(1)

     //gas cost calculation
     const {gasUsed, effectiveGasPrice} = transactionReceipt
     const gasCost=gasUsed.mul(effectiveGasPrice).toString()

   // getting the contract and deployer balance after withdraw
    const endingContractBalance= await fundme.provider.getBalance(fundme.address)
    const endingDeployerBalance= await fundme.provider.getBalance(deployer)

   // as we had withdrawn all the balance the contract balance musts be 0 and the deployer balance must be equal to the contract balance plus  the initial deployer balance minus the gas cost
    assert.equal(endingContractBalance.toString(),0)
    assert.equal(
    startingContractBalance.add(startingDeployerBalance).toString(),
    endingDeployerBalance.add(gasCost).toString()
    )
})

it("should receive transaction from multiple accounts",async function(){

// getting the accounts
const accounts = await ethers.getSigners()
// receiving funds from multiple accounts
// lopping through all addresses and connecting each of them with the contract
for(let i=0;i<6;i++){
const connectedContract= fundme.connect(accounts[i].address)
await connectedContract.fund({value:sendValue})//sending ethers via the connected accounnts to the contract
}

//checking the initial balance of the contract and that of the deployer 
const startingContractBalance= await fundme.provider.getBalance(fundme.address)
const startingDeployerBalance= await fundme.provider.getBalance(deployer)

 // calling the withdraw function
 const transactionResponse= await fundme.withdraw()
 const transactionReceipt= await transactionResponse.wait(1)


 //getting the contract and deployer balance after withdraw
 const endingContractBalance= await fundme.provider.getBalance(fundme.address)
 const endingDeployerBalance= await fundme.provider.getBalance(deployer)


//assertions and expections
// as we had withdrawn all the balance the contract balance musts be 0 and the deployer balance must be equal to the contract balance plus tfhe initial deployer balance minus the gas cost
assert.equal(endingContractBalance.toString(),0)
assert.equal(
startingContractBalance.add(startingDeployerBalance).toString(),
endingDeployerBalance.add(gasCost).toString()
)
// checking if the funders array is resert properly
await expect(fundme.funders(0)).to.be.reverted

// making sure the mapping is updated properly to 0 after 
for(let i=0;i<6;i++){
    assert.equal( await fundme.addressToMoney(accounts[i].address,0))
}
})
it("allows only owner to withdraw money",async function(){
    const accounts = await ethers.getSigners()
    const attacker =accounts[1]
    const connectedAccounts= await fundme.connect(attacker.address)
    await expect(connectedAccounts.withdraw()).to.be.reverted
})



})










})