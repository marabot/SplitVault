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
      
        await VM.createTipVault('Tip !', trader4,{from:trader1});
        await VM.createTipVault('Tip 2564564654', trader4, {from:trader2});
        await VM.createTipVault('Nom _ Test',trader4, {from:trader3});
      
        let allSB =  await VM.getAllTipVaults(); 
        
        console.log(' tab = > ' + allSB.length);
        console.log('addd '  + allSB[0].addr);
        console.log(allSB);
        assert(allSB.length ==3);
        assert(allSB[0].name == "Tip !");
        assert(allSB[0].addr != "0x0");
        assert(allSB[0].from == trader1);
        assert(allSB[0].receiver == trader4);
        assert(allSB[0].totalAmount == 0);

        assert(allSB.length ==3);
        assert(allSB[1].name == "Tip 2564564654");
        assert(allSB[1].addr != "0x0");
        assert(allSB[1].from == trader2);
        assert(allSB[1].receiver == trader4);
        assert(allSB[1].totalAmount == 0);

        assert(allSB.length ==3);
        assert(allSB[2].name == "Nom _ Test");
        assert(allSB[2].addr != "0x0");
        assert(allSB[2].from == trader3);
        assert(allSB[2].receiver == trader4);
        assert(allSB[2].totalAmount == 0);       
        
    }, 'échec de la création du SplitVault');


    it('should deposit in a splitVault', async()=>{
        
        await VM.createTipVault('nom test', trader4, {from:trader1}); 
        let allSB =  await VM.getAllTipVaults();    

        let tipVault0= allSB[0];  
       
        const depositvalue=web3.utils.toWei('0.1');
        await VM.tip(tipVault0.addr, {from:trader1,value:depositvalue}); 

        let tpContract = await TipVault.at(tipVault0.addr); 
        let TPBalAfter =  await tpContract.getBalance();
       
        let tip = await tpContract.getTipStructOfUser(trader1);

        assert(TPBalAfter == depositvalue);              
        assert(tip.length == 3);    
        assert(tip.amount == depositvalue);    
        assert(tip.from == trader1); 

    }, 'échec du dépot du Vault');


    it('should retire', async()=>{

        let trader1Balance,trader2Balance,trader3Balance,trader4Balance;
        let trader1BalanceAfter,trader2BalanceAfter,trader3BalanceAfter,trader4BalanceAfter;
        let VFbalance;

        [trader1Balance,trader2Balance,trader3Balance,trader4Balance,VFBalance] = await Promise.all([
            web3.eth.getBalance(trader1),
            web3.eth.getBalance(trader2),
            web3.eth.getBalance(trader3),
            web3.eth.getBalance(trader4),
            web3.eth.getBalance(VF.address)
         ]);/*
         console.log('balance 1 ' + trader1Balance);
         console.log('balance 2 ' + trader2Balance);
         console.log('balance 3 ' + trader3Balance);
         console.log('balance 4 ' + trader4Balance);
        */
        await VM.createTipVault('nom test', trader4, {from:trader1});      

        let allSB =  await VM.getAllTipVaults();   
        let tipVault0= allSB[0];  

        let tpContract = await TipVault.at(allSB[0].addr);     

        const depositvalue=web3.utils.toWei('1');   
        await VM.tip(tipVault0.addr, {from:trader1,value:depositvalue}); 
        await VM.tip(tipVault0.addr, {from:trader2,value:depositvalue}); 
        await VM.tip(tipVault0.addr, {from:trader3,value:depositvalue*2}); 

        let TPBalAfter =  await tpContract.getBalance();
       
        assert(TPBalAfter == depositvalue*4);

        await VM.closeTipVault(tipVault0.addr,{from:trader1});  
        await VM.retireTips(tipVault0.addr,{from:trader1});  
        
        [trader1BalanceAfter,trader2BalanceAfter,trader3BalanceAfter,trader4BalanceAfter,VFbalance] = await Promise.all([
      
           web3.eth.getBalance(trader1),
           web3.eth.getBalance(trader2),
           web3.eth.getBalance(trader3),
           web3.eth.getBalance(trader4),
           web3.eth.getBalance(VF.address)
        ]);
        /*
        console.log('balance 1 ' + trader1BalanceAfter);
        console.log('balance 2 ' + trader2BalanceAfter);
        console.log('balance 3 ' + trader3BalanceAfter);
        console.log('balance 4 ' + trader4BalanceAfter);
      */
        assert(Math.round(web3.utils.fromWei(trader4BalanceAfter)) == Math.round(web3.utils.fromWei(trader4Balance)) + web3.utils.fromWei(depositvalue)*4);  
       

    }, 'échec du retrait splité');
    
}


);


