const SplitVault = artifacts.require('SplitVault.sol');
const Dai = artifacts.require('mocks/Dai.sol');

contract('SplitVault' , accounts =>{
    let dai,SB;
    const [trader1, trader2, trader3, trader4, trader5]=[accounts[0], accounts[1], accounts[2], accounts[3], accounts[4], accounts[5]];
    const DAI = web3.utils.fromAscii('DAI'); 
    
    
    beforeEach(async ()=>{
        
        SB = await SplitVault.new();
        dai = await Dai.new(); 
        
        const amount = web3.utils.toWei('1000');
        
        await dai.faucet(trader1, amount)
        await dai.approve(
            SB.address, 
            amount, 
            {from: trader1}
        );

        await dai.faucet(trader2, amount)
        await dai.approve(
            SB.address, 
            amount, 
            {from: trader2}
        );

        await dai.faucet(trader3, amount)
        await dai.approve(
            SB.address, 
            amount, 
            {from: trader3}
        );

        await dai.faucet(trader4, amount)
        await dai.approve(
            SB.address, 
            amount, 
            {from: trader4}
        );

        await dai.faucet(trader5, amount)
        await dai.approve(
            SB.address, 
            amount, 
            {from: trader5}
        );
       
        SB.addToken(DAI, dai.address); 
    })
  

    it.only('should create a SplitVault', async ()=>{
       
        await SB.createSplitVault('nom test', {from:trader1});
        await SB.createSplitVault('nom test 22', {from:trader2});  
        await SB.createSplitVault('nom test 33', {from:trader3});     

        let allSB =  await SB.getAllSplitVaults(); 
      

        let mySB =  await SB.getSplitVaults(trader1); 
        console.log(mySB);


        assert(allSB[0] !== "undefined");
        assert(allSB.length !== 0);
        assert(allSB[0].splitId === "0");
        assert(allSB[0].name === "nom test");
        assert(allSB[0].totalAmount === "0");
        
    }, 'échec de la création du SplitVault');

    it('should deposit in a splitVault', async()=>{

        await SB.createSplitVault('nom test', {from:trader1});        

        await SB.deposit(0, 190, {from:trader2});
        let newVault = await SB.getVaultsByAddress(trader2);          
        console.log(newVault[0].amount);     
       
        assert(newVault[0].from===trader2);
        assert(newVault[0].amount==='190');
       
        let Vault =  await SB.getVaultsByAddress(trader2); 
        console.log('Vault');
        console.log(Vault);

        let allSB =  await SB.getAllSplitVaults(); 
        console.log(allSB[0]);
        assert(allSB[0].totalAmount === "190");

       
       

    }, 'échec du dépot du Vault');


    it('should compute parts', async()=>{

        await SB.createSplitVault('nom test', {from:trader1});  
        
        await SB.deposit(0, '400', {from:trader2});
        await SB.deposit(0, '300', {from:trader3});
        await SB.deposit(0, '200', {from:trader4});
        await SB.deposit(0, '100', {from:trader5});        
      
        await SB.closeSubSplitVault(0, {from:trader1});

        let splitB = await SB.getSplitVaultById(0);
        let depo2 = await SB.getVaultsByAddress(trader2);
        let depo3 = await SB.getVaultsByAddress(trader3);
        let depo4 = await SB.getVaultsByAddress(trader4);
        let depo5 = await SB.getVaultsByAddress(trader5); 


        let allSB =  await SB.getAllSplitVault(); 
        console.log(allSB[0]);
     
       

        console.log("====>>>>>>>>>> PARTS  "   + 
                            depo2[0].part + ' --- ' );

        assert(splitB.open===false);
        assert(depo2[0].part ==='400');
        assert(depo3[0].part ==='300');
        assert(depo4[0].part ==='200');
        assert(depo5[0].part ==='100');

    }, 'échec du calcul des parts');

    it('should split and retire', async()=>{
        let daiBalance = await dai.balanceOf(SB.address);
        //console.log("====>>>>>>>>>> DAI"   + ' --- ' + web3.utils.fromWei(daiBalance));

        await SB.createSplitVault('nom test', {from:trader1});        

        await SB.deposit(0, web3.utils.toWei('200'), {from:trader2});
       
        daiBalance = await dai.balanceOf(SB.address)
        //console.log("====>>>>>>>>>> DAI after deposit 1 "   + ' --- ' + web3.utils.fromWei(daiBalance));
        await SB.deposit(0, web3.utils.toWei('100'), {from:trader3});
        await SB.deposit(0, web3.utils.toWei('100'), {from:trader4});             
       
        daiBalance = await dai.balanceOf(SB.address)
        //console.log("====>>>>>>>>>> DAI after all deposit "   + ' --- ' + web3.utils.fromWei(daiBalance));
        await SB.closeSubSplitVault(0, {from:trader1});

        let depo2 = await SB.getVaultsByAddress(trader2);
        let depo3 = await SB.getVaultsByAddress(trader3);
        let depo4 = await SB.getVaultsByAddress(trader4);
        /*
        console.log("====>>>>>>>>>> PARTS "   + 
                            depo2[0].part + ' --- ' + 
                            depo3[0].part + ' --- ' +
                            depo4[0].part  );
*/
        // await SB.retire(0, web3.utils.toWei('20'),{from:trader1});
        await SB.retire(0, web3.utils.toWei('20'),{from:trader1});
        let trader2Balance,trader3Balance,trader4Balance;
        
        [trader2Balance,trader3Balance,trader4Balance,daiBalance] = await Promise.all([
            dai.balanceOf(trader2),
            dai.balanceOf(trader3),
            dai.balanceOf(trader4),
            dai.balanceOf(SB.address)    
        ]);

        //console.log("====>>>>>>> " +trader2Balance);
        trader2Balance= web3.utils.fromWei(web3.utils.toBN(trader2Balance)); 
        trader3Balance= web3.utils.fromWei(web3.utils.toBN(trader3Balance));
        trader4Balance= web3.utils.fromWei(web3.utils.toBN(trader4Balance));
        daiBalance= web3.utils.fromWei(web3.utils.toBN(daiBalance));
            
  /*console.log("====>>>>>>>>>> " + trader2Balance
                     + ' --- ' + trader3Balance
                     + ' --- ' + trader4Balance
                     + ' --- ' +  daiBalance);
*/
        assert(trader2Balance ==='810');        
        assert(trader3Balance ==='905');  
        assert(trader4Balance ==='905');     

    }, 'échec du retrait splité');
    
}


);


