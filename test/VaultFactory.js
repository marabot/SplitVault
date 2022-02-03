const SplitVault = artifacts.require('SplitVault.sol');
const VaultFactory = artifacts.require('VaultFactory.sol');
const Dai = artifacts.require('mocks/Dai.sol');

contract('VaultFactory' , accounts =>{
    let dai,VF, SB;
    const [trader1, trader2, trader3, trader4, trader5]=[accounts[0], accounts[1], accounts[2], accounts[3], accounts[4], accounts[5]];
    const DAI = web3.utils.fromAscii('DAI'); 
    
    
    beforeEach(async ()=>{
        VF = await VaultFactory.new();
       // SB = await SplitVault.new();
        dai = await Dai.new(); 
        
        const amount = web3.utils.toWei('1000');
        
        await dai.faucet(trader1, amount)
        await dai.approve(
            VF.address, 
            amount, 
            {from: trader1}
        );

        await dai.faucet(trader2, amount)
        await dai.approve(
            VF.address, 
            amount, 
            {from: trader2}
        );

        await dai.faucet(trader3, amount)
        await dai.approve(
            VF.address, 
            amount, 
            {from: trader3}
        );

        await dai.faucet(trader4, amount)
        await dai.approve(
            VF.address, 
            amount, 
            {from: trader4}
        );

        await dai.faucet(trader5, amount)
        await dai.approve(
            VF.address, 
            amount, 
            {from: trader5}
        );
       
        VF.addToken(DAI, dai.address); 
    })
  

    it('should create  SplitVaults', async ()=>{

        await VF.createSplitVault('nom test', {from:trader1});
        await VF.createSplitVault('nom test', {from:trader2});
        await VF.createSplitVault('nom test', {from:trader3});
      
        let allSB =  await VF.getAllSplitVaults(); 
        
        console.log(' tab = > ' + allSB.length);
        console.log(allSB);
        assert(allSB.length ==3);
       
        
    }, 'échec de la création du SplitVault');

    it('should deposit in a splitVault', async()=>{

        await VF.createSplitVault('nom test', {from:trader1}); 

        let allSB =  await VF.getAllSplitVaults(); 
        //console.log(allSB);

        let splitAddrr= allSB[0];        
        //console.log(splitAddrr);

        await dai.approve(
            splitAddrr, 
            '1000', 
            {from: trader1}
        );     

        await VF.deposit('10',splitAddrr, {from:trader1}); 

        let spCopntract = await SplitVault.at(splitAddrr); 

       //await spCopntract.deposit('100', {from:trader1}); 

        let allBags =  await spCopntract.getAllBags(); 
        console.log(allBags);
        assert(allBags.length == 1);    
        assert(allBags[0].amount == '10');    
        assert(allBags[0].from == trader1);      
       

    }, 'échec du dépot du Vault');


    it('should compute parts', async()=>{

        await VF.createSplitVault('nom test', {from:trader1});      

        let allSB =  await VF.getAllSplitVaults(); 
        let splitAddrr= allSB[0];        
        //console.log(splitAddrr);
        let spContract = await SplitVault.at(splitAddrr); 
      

        await dai.approve(
            splitAddrr, 
            web3.utils.toWei('1000'), 
            {from: trader1}
        );     

        await dai.approve(
            splitAddrr, 
            web3.utils.toWei('1000'), 
            {from: trader2}
        );     

        await dai.approve(
            splitAddrr, 
            web3.utils.toWei('1000'), 
            {from: trader3}
        );     
        
   
        await VF.deposit('200', splitAddrr,{from:trader1}); 
        await VF.deposit('300', splitAddrr,{from:trader2}); 
        await VF.deposit('500',splitAddrr, {from:trader3}); 

        await VF.closeSplitVault(splitAddrr,{from:trader1});  

        spContract = await SplitVault.at(splitAddrr); 
        let tt= await spContract.isSplitOpen();
        console.log('open ??? =>'+  tt);
          


        let allBags =  await spContract.getAllBags(); 
        console.log(allBags);
        assert(allBags.length == 3);    
        assert(allBags[0].part == '200');    
        assert(allBags[1].part == '300'); 
        assert(allBags[2].part == '500');      

    }, 'échec du calcul des parts');

    it.only('should split and retire', async()=>{
        await VF.createSplitVault('nom test', {from:trader1});      

        let allSB =  await VF.getAllSplitVaults(); 
        let splitAddrr= allSB[0];        
        //console.log(splitAddrr);
        let spContract = await SplitVault.at(splitAddrr); 
      

        await dai.approve(
            splitAddrr, 
            web3.utils.toWei('1000'), 
            {from: trader1}
        );     

        await dai.approve(
            splitAddrr, 
            web3.utils.toWei('1000'), 
            {from: trader2}
        );     

        await dai.approve(
            splitAddrr, 
            web3.utils.toWei('1000'), 
            {from: trader3}
        );     
        
   
        await VF.deposit(web3.utils.toWei('200'), splitAddrr,{from:trader1}); 
        await VF.deposit(web3.utils.toWei('300'), splitAddrr,{from:trader2}); 
        await VF.deposit(web3.utils.toWei('500'),splitAddrr, {from:trader3}); 

        await VF.closeSplitVault(splitAddrr,{from:trader1});  
        /*
        console.log("====>>>>>>>>>> PARTS "   + 
                            depo2[0].part + ' --- ' + 
                            depo3[0].part + ' --- ' +
                            depo4[0].part  );
*/
        // await SB.retire(0, web3.utils.toWei('20'),{from:trader1});
        let spBalance = await dai.balanceOf(splitAddrr) 
        console.log('splitcontract balance : ' + spBalance);
        let trader2Balance,trader3Balance,trader4Balance;
        
        [trader1Balance,trader2Balance,trader3Balance,trader4Balance,daiBalance] = await Promise.all([
            dai.balanceOf(trader1),
            dai.balanceOf(trader2),
            dai.balanceOf(trader3),
            dai.balanceOf(trader4),
            dai.balanceOf(VF.address)    
        ]);

        let allBags =  await spContract.getAllBags(); 
        console.log(allBags);
        await VF.retire( web3.utils.toWei('20'), splitAddrr, {from:trader1});
    
        [trader1Balance,trader2Balance,trader3Balance,trader4Balance,daiBalance] = await Promise.all([
            dai.balanceOf(trader1),
            dai.balanceOf(trader2),
            dai.balanceOf(trader3),
            dai.balanceOf(trader4),
            dai.balanceOf(VF.address)    
        ]);

        spBalance = await dai.balanceOf(splitAddrr) 
        console.log("====>>>>>>> " +spBalance);
        console.log("trader1 =>  " +trader1Balance);
        console.log("trader2 =>  " +trader2Balance);
        console.log("trader3 =>  " +trader3Balance);

        trader1Balance= web3.utils.fromWei(trader1Balance); 
        trader2Balance= web3.utils.fromWei(web3.utils.toBN(trader2Balance)); 
        trader3Balance= web3.utils.fromWei(web3.utils.toBN(trader3Balance));
        trader4Balance= web3.utils.fromWei(web3.utils.toBN(trader4Balance));
        console.log("trader1 =>  " +trader1Balance);
        console.log("trader2 =>  " +trader2Balance);
        console.log("trader3 =>  " +trader3Balance);
        daiBalance= web3.utils.fromWei(web3.utils.toBN(daiBalance));
            
        allBags =  await spContract.getAllBags(); 
        console.log(allBags);
  /*console.log("====>>>>>>>>>> " + trader2Balance
                     + ' --- ' + trader3Balance
                     + ' --- ' + trader4Balance
                     + ' --- ' +  daiBalance);
*/
        assert(trader1Balance ==='804');        
        assert(trader2Balance ==='706');  
        assert(trader3Balance ==='510');     

        assert(web3.utils.fromWei(allBags[0].amount) ==='196');        
        assert(web3.utils.fromWei(allBags[1].amount) ==='294');  
        assert(web3.utils.fromWei(allBags[2].amount) ==='490');    

    }, 'échec du retrait splité');
    
}


);


