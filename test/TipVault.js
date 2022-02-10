const TipVault = artifacts.require('TipVault.sol');
const VaultFactory = artifacts.require('VaultFactory.sol');
const VaultMain = artifacts.require('VaultMain.sol');
const Dai = artifacts.require('mocks/Dai.sol');

contract('VaultFactory' , accounts =>{
    let dai,VF,VM, SB;
    const [trader1, trader2, trader3, trader4, trader5]=[accounts[0], accounts[1], accounts[2], accounts[3], accounts[4], accounts[5]];
    const DAI = web3.utils.fromAscii('DAI'); 
    
    
    beforeEach(async ()=>{
        VF = await VaultFactory.new();
       
        dai = await Dai.new(); 
        VM = await VaultMain.new(VF.address)
        
        const amount = web3.utils.toWei('1000');
        
        await dai.faucet(trader1, amount)
        await dai.approve(
            VM.address, 
            amount, 
            {from: trader1}
        );

        await dai.faucet(trader2, amount)
        await dai.approve(
            VM.address, 
            amount, 
            {from: trader2}
        );

        await dai.faucet(trader3, amount)
        await dai.approve(
            VM.address, 
            amount, 
            {from: trader3}
        );

        await dai.faucet(trader4, amount)
        await dai.approve(
            VM.address, 
            amount, 
            {from: trader4}
        );

        await dai.faucet(trader5, amount)
        await dai.approve(
            VM.address, 
            amount, 
            {from: trader5}
        );
       
        VF.addToken(DAI, dai.address); 
    })
  

    it('should create  SplitVaults', async ()=>{

        await VM.createTipVault('Tip 1', {from:trader1});
        await VM.createTipVault('Tip 2', {from:trader2});
        await VM.createTipVault('nom test', {from:trader3});
      
        let allSB =  await VM.getAllTipVaults(); 
        
        console.log(' tab = > ' + allSB.length);
        console.log(allSB);
        assert(allSB.length ==3);
       
        
    }, 'échec de la création du SplitVault');

    it('should deposit in a splitVault', async()=>{

        await VM.createTipVault('nom test', {from:trader1}); 

        let allSB =  await VM.getAllTipVaults(); 
        //console.log(allSB);

        let tipVault0= allSB[0];        
        console.log("adress "+ tipVault0.addr);

        await dai.approve(
            tipVault0.addr, 
            '1000', 
            {from: trader1}
        );     

        await VM.tip('10',tipVault0.addr, {from:trader1}); 

        let tpCopntract = await TipVault.at(tipVault0.addr); 

       //await spCopntract.deposit('100', {from:trader1}); 

        let allBags =  await tpCopntract.getAllTips(); 
        console.log(allBags);
        assert(allBags.length == 1);    
        assert(allBags[0].amount == '10');    
        assert(allBags[0].from == trader1);      
       

    }, 'échec du dépot du Vault');


    it('should retire', async()=>{

        let trader2Balance,trader3Balance,trader4Balance;

        await VM.createTipVault('nom test', {from:trader1});      

        let allSB =  await VM.getAllTipVaults(); 
        let tipVault0= allSB[0];        
        console.log(tipVault0.addr);
        let tpContract = await TipVault.at(tipVault0.addr); 
      

        await dai.approve(
            tipVault0.addr, 
            web3.utils.toWei('1000'), 
            {from: trader1}
        );     

        await dai.approve(
            tipVault0.addr, 
            web3.utils.toWei('1000'), 
            {from: trader2}
        );     

        await dai.approve(
            tipVault0.addr, 
            web3.utils.toWei('1000'), 
            {from: trader3}
        );     
        
   
        await VM.tip(web3.utils.toWei('300'), tipVault0.addr, {from:trader1}); 
        await VM.tip(web3.utils.toWei('300'), tipVault0.addr, {from:trader2}); 
        await VM.tip(web3.utils.toWei('500'), tipVault0.addr, {from:trader3}); 

        await VM.closeTipVault(tipVault0.addr,{from:trader1});  
        await VM.retireTips(tipVault0.addr,trader4,{from:trader1});  

        [trader1Balance,trader2Balance,trader3Balance,trader4Balance,daiBalance] = await Promise.all([
            dai.balanceOf(trader1),
            dai.balanceOf(trader2),
            dai.balanceOf(trader3),
            dai.balanceOf(trader4),
            dai.balanceOf(VF.address)    
        ]);
        console.log("trader 4 = " + web3.utils.fromWei(web3.utils.toBN(trader4Balance)));
       
        assert(web3.utils.fromWei(web3.utils.toBN(trader4Balance)) == 2100);      

    }, 'échec du retrait splité');
    
}


);


