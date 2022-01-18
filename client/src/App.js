
import React, {useState, useEffect} from "react";
import Header from './Header.js';
import SplitVault from './SplitVault.js';
import Vaults from './Vaults.js';
import './Main.css';
import NewVault from "./NewSplit.js";
import Deposit from "./Deposit.js";
import DaiFaucet from "./DaiFaucet.js";
import Withdraw from "./Withdraw.js";


//function getSplitVault(address sbOwner) external view returns(SplitVault[] memory){       
function App({web3,  contracts, accounts}) {
 
    const [tokens, setTokens] = useState();
    const [userAddr, setUserAddr] = useState('');

    const [AllSplitVaultss, setAllSplitVaults] = useState([]);
    const [MySplitVault, setMySplitVault] = useState([]);
    const [AllVaults, setAllVaults]= useState([]);   
    const [MyVaults, setMyVaults]= useState([]); 

    const [showDeposit, setShowDeposit] = useState([]);
    const [DepositVaultId, setDepositVaultId] = useState([]);

    const [showCreate, setShowCreate] = useState([]);
    const [showWithdraw, setShowWithdraw] = useState([]);


    const createSplit = async(name)=>{
      //alert(name);
      //alert(userAddr);
      await contracts.splitVault.methods.createSplitVault(name).send({from:userAddr});
      const AllSplitVaults = await contracts.splitVault.methods.getAllSplitVaults().call();       
      setAllSplitVaults(AllSplitVaults);
      setShowCreate(false);

    };

    /////////////////////////////    SHOW and HIDE POPUP
    const showPopupDeposit= function(id){
      setDepositVaultId(id);
      setShowDeposit(true);
    }
  

    const closePopupDepo = function(){
      setShowDeposit(false);
    }


    const showCreateCard= function(){      
      setShowCreate(true);
    }
  

    const closePopupCreate = function(){
      setShowCreate(false);
    }

    const showWithdrawCard= function(){      
      setShowWithdraw(true);
    }
  

    const closePopupWithdraw = function(){
      setShowWithdraw(false);
    }

   ///////////////////////// COMPONENTs RENDERER
    const depositComponetRender = function(id)
    {         
      if (showDeposit==true){
        return (
          <Deposit
              VaultId={DepositVaultId}
              deposit={deposit}
              closePopupDepo={closePopupDepo}
              web3={web3}
           />
        )
      }     
    }   

    const createComponetRender = function()
    {         
      if (showCreate==true){
        return (
          <NewVault           
          createSplit={createSplit} 
          closePopupCreate={closePopupCreate}          
        />
        )
      }     
    }   

    const withdrawComponetRender = function()
    {         
      if (showWithdraw==true){
        return (
          <Withdraw
              VaultId={DepositVaultId}
              withdraw={withdraw}
              closePopupWithdraw={closePopupWithdraw}
          />      
        
        )
      }     
    }   

    const withdraw= async(amount)=>{
      try{   
        await contracts.splitVault.methods.retire(DepositVaultId, amount).send({from:userAddr});
        closePopupDepo();
      }catch(e){
          alert('erreur deposit !  '  +  e);
      }   
}
   
    const deposit= async(amount)=>{
          try{   
            await contracts.splitVault.methods.deposit(DepositVaultId, amount).send({from:userAddr});
            closePopupDepo();
          }catch(e){
              alert('erreur deposit !  '  +  e);
          }   
    }

    const closeSplit = async(id)=>{
        try{   
          await contracts.splitVault.methods.closeSubSplitVault(id).send({from:userAddr});
          closePopupDepo();
        }catch(e){
            alert('erreur deposit !  '  +  e);
        }   
    }
    
    const mySplitVault= function(){
        if (MySplitVault.length==0)
        {
          return(
            <tbody>
           <div className="card">Vous n'avez crée aucun splitVault  <button className="btn btn-primary" onClick={()=>showCreateCard()}>Create SplitVault</button></div>
           </tbody>
          )
        }
        else
        {
          return(
            <SplitVault
            allSplits={MySplitVault}
            title= 'My SplitVaults'
            showDeposit={showPopupDeposit}
            showCreate={showCreateCard}   
            closeSplit={closeSplit} 
            showWithdraw={showWithdrawCard}             
            />
          )
        }
    }

    const myVaults= function(){
      if (MyVaults.length==0)
      {
        return(
          <tbody>
         <div className="card">Vous n'avez fait aucun dépot  </div>
         </tbody>
        )
      }
      else
      {
        return(
          <Vaults
            vaults={MyVaults}
            title= 'My Vaults'
           />
        )
      }
   }

    const displaystuff = function(){     
      
     alert('');
     }

  useEffect(()=>{
    const init = async()=>{
      setShowDeposit(false);
      setShowCreate(false);
      const acc= accounts[0];      
      setUserAddr(acc);

      const rawTokens = await contracts.splitVault.methods.getTokens().call();
      const tokens = rawTokens.map(token=>({
          ...token,
          ticker: web3.utils.hexToUtf8(token.ticker)
      }));      

      const allSplitVaults = await contracts.splitVault.methods.getAllSplitVaults().call();      
      setAllSplitVaults(allSplitVaults);
      
      const mySplitVault = await contracts.splitVault.methods.getSplitVaults(accounts[0]).call();   
      setMySplitVault(mySplitVault);
      
      const myVaults = await contracts.splitVault.methods.getVaultByAdress(acc).call();   
      setMyVaults(myVaults);
      
      
      
      //alert(AllSplitVaults[0][1]);
      //alert(AllSplitVaults[0]);
      //const Vaults= await contracts.splitVault.methods.getVaultsByAddress(user.address);
       
      //setAllVaults(Vaults);    
      //alert(acc); 
      //alert(userAddr);
      
    }
    init();
    },[]);



    return (    
      <div id="app">
        <Header 
        userAddr={userAddr}/>
        <button className="btn btn-primary" onClick={displaystuff}>test</button>
        
        {createComponetRender()}
        {depositComponetRender()}
        {withdrawComponetRender()}
       
        {mySplitVault()}
        {myVaults()}
       
       
        
       
      </div>    
    );
}

export default App;

