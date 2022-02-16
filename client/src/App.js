
import React, {useState, useEffect} from "react";
import Header from './Header.js';
import TipVault from './TipVaults.js';
import Vaults from './Vaults.js';
import './Main.css';
import NewVault from "./NewTipVault.js";
import Deposit from "./Deposit.js";
import Withdraw from "./Withdraw.js";
import {Helmet} from "react-helmet";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';


//function getSplitVault(address sbOwner) external view returns(SplitVault[] memory){       
function App({web3,  contracts, accounts}) {
 
    const [tokens, setTokens] = useState();
    const [userAddr, setUserAddr] = useState('');

   
    const [MySplitVaults, setMySplitVaults] = useState([]);      
    const [MyVaults, setMyVaults]= useState([]); 

    const [MyTipVaults, setMyTipVaults] = useState([]);      
    const [MyTips, setMyTips]= useState([]); 

    const [showDeposit, setShowDeposit] = useState([]);
    const [DepositVaultAddr, setDepositVaultAddr] = useState([]);

    const [showCreate, setShowCreate] = useState([]);
    const [showWithdraw, setShowWithdraw] = useState([]);


    // 0 = tipVault     1= tips
    const [menu, setMenu]=useState(0);
  

    const createSplit = async(name)=>{
      //alert(name);
      //alert(userAddr);
      await contracts.vaultMain.methods.createTipVault(name).send({from:userAddr});
      const AllTipVaults = await contracts.vaultMain.methods.getTipVaults(userAddr).call();       
      setMyTipVaults(AllTipVaults);
      setShowCreate(false);

    };

   
    

    /////////////////////////////    SHOW and HIDE POPUP
    const showPopupDeposit= function(addr){
     
      setDepositVaultAddr(addr);
     
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
    const depositComponetRender = function()
    {         
      if (showDeposit==true){
       
        return (
          <Deposit
              VaultAddr={DepositVaultAddr}
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
              VaultAddr={DepositVaultAddr}
              withdraw={withdraw}
              closePopupWithdraw={closePopupWithdraw}
          />             
        )
      }     
    }   

    const withdraw= async(tipVaultAddr)=>{
    

      try{   
        
        await contracts.vaultMain.methods.retireTips(tipVaultAddr, userAddr).send({from:userAddr});
        //closePopupDepo();
      }catch(e){
          alert('erreur deposit !  '  +  e);
      }   
}
   
    const deposit= async(tipVaultAddr,amount)=>{   
      setDepositVaultAddr(tipVaultAddr);
          try{  
          
            await contracts.vaultMain.methods.tip(web3.utils.toWei(amount),tipVaultAddr).send({from:userAddr, value:web3.utils.toWei(amount)});
            closePopupDepo();
          }catch(e){
              alert('erreur deposit !  '  +  e);
          }   
    }

    const closeSplit = async(tipVaultAddr)=>{
        try{   
          await contracts.vaultMain.methods.closeTipVault(tipVaultAddr).send({from:userAddr});
         // closePopupDepo();
        }catch(e){
            alert('erreur deposit !'  +  e);
        }   
    }
    
    const myTipVaultsRenderer= function(){
         
      /// bouton create desactive
        if (MyTipVaults.length==0)
        {
          return(
            <tbody>
                     <div className="card"><button className="btn btn-primary disabled" onClick={showCreateCard} >Create SplitVault</button></div>
           </tbody>
          )
        }
        else
        {
          return(
            <TipVault
            tip_Vaults={MyTipVaults}
            title= 'My TipVAults'
            showDeposit={showPopupDeposit}
            showCreate={showCreateCard}   
            closeSplit={closeSplit} 
            withDraw={withdraw} 
            addrUser={userAddr}            
            />
          )
        }
    }

 

    const text= {
      color:"white", 
      fontSize:30,
      width:"100%"
    }


    const myVaults= function(){

      const text= {
        color:"white",
        textAlign:"center", 
        fontSize:20,
        width:"100%"
      }
      if (MyVaults.length==0)
      {
        return(
          <tbody>
         <div className="card" style={text}>No tip yet from this address</div>
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

    

  useEffect(()=>{
    const init = async()=>{
      setShowDeposit(false);
      setShowCreate(false);
      const acc= accounts[0];      
      setUserAddr(acc);

      const rawTokens = await contracts.vaultMain.methods.getTokens().call();
      const tokens = rawTokens.map(token=>({
          ...token,
          ticker: web3.utils.hexToUtf8(token.ticker)
      }));           
      
      
      const myTipVaults = await contracts.vaultMain.methods.getTipVaults(acc).call();  
      setMyTipVaults(myTipVaults);    
      
      const myTips = await contracts.vaultMain.methods.getTipsByOwnerAddr(acc).call();   
      setMyTips(myTips); 
      // alert(tokens);
      
    }
    init();
    },[]);


    const styleBack= {
      color:"white", 
      fontSize:30,
      width:"100%"
   }

   const boutonMenu= {
    color:"white",
    backgroundColor:"#002255",
    fontSize:15,
    width:"150px"
 }

 const paddingRow={
   padding:'50px'
 }


function menuSelectTipVaults(){
  setMenu(0);
}
   
function menuSelectTips(){
  setMenu(1);
 
}



    return (    
      <div id="app" style={styleBack}>
       <Helmet>
       </Helmet>
        <Header 
        userAddr={userAddr}
       />
        <Row style={paddingRow}>
          <Col className="col-sm-4"></Col>  
          <Col className="col-sm-2"><div ><button id="boutMenuTipVault" className="btn btn-primary" style={boutonMenu} onClick={()=>menuSelectTipVaults()}>TipVault</button></div></Col>  
          <Col className="col-sm-2"><div ><button id="boutMenuTip" className="btn btn-primary"  style={boutonMenu} onClick={()=>menuSelectTips()}>Tips</button></div></Col> 
          <Col className="col-sm-4"></Col>  
        </Row>
        <Row>
          <Col className="col-sm-2"></Col>
          <Col className="col-sm-8">          
             {menu==0?myTipVaultsRenderer():myVaults()}
          </Col>
          <Col className="col-sm-2"></Col>
     
        </Row>
        {createComponetRender()}
        {depositComponetRender()}
        {withdrawComponetRender()}
       
      </div>    
    );
}

export default App;

