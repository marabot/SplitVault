const SplitVault = artifacts.require("SplitVault.sol");
const Dai = artifacts.require("Mocks/Dai.sol")


const DAI = web3.utils.fromAscii('DAI');

module.exports =async function (deployer, _network, accounts) {

    const eth = 10^18;
    const [ trader1, trader2, trader3,trader4,_]= accounts;
    await deployer.deploy(SplitVault); 
    const Spb = await SplitVault.deployed()
    const dai = await deployer.deploy(Dai);
    await Spb.addToken(DAI, dai.address);
    
    const amount = 1000*eth;
    await dai.faucet(trader1, amount)
    await dai.approve(
      SplitVault.address, 
      amount, 
      {from: trader1}
    );   

    await dai.faucet( trader2, amount)
    await dai.approve(
      SplitVault.address, 
      amount, 
      {from: trader2}
    );   

    

    await dai.faucet(trader3, amount)
    await dai.approve(
      SplitVault.address, 
      amount, 
      {from: trader3}
    );   

    await dai.faucet(trader4, amount)
    await dai.approve(
      SplitVault.address, 
      amount, 
      {from: trader4}
    );   

    const amount2 = web3.utils.toWei("50");

   /* await Spb.createSplitVault('nom test', {from:trader1}); 
    await Spb.createSplitVault('nom test', {from:trader4});   
    await Spb.deposit(0, 190, {from:trader2}); 
    await Spb.deposit(0, 350, {from:trader3}); 
    await Spb.deposit(0, 250, {from:trader4});   
    await Spb.closeSubSplitVault(0, {from:trader1});*/

}
