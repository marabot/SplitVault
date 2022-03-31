
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
import {getContracts} from './utils.js';

//function getSplitVault(address sbOwner) external view returns(SplitVault[] memory){       
function App() {
    
    const [userAddr, setUserAddr] = useState('');
    const [contracts,setContracts] = useState();
  
    const [web3, setWeb3] = useState([]);
    const [accounts, setAccounts] = useState([]);

    const [MyVaults, setMyVaults]= useState([]); 

    const [MyTipVaults, setMyTipVaults] = useState([]);      
    const [MyTips, setMyTips]= useState([]); 

    const [showDeposit, setShowDeposit] = useState([]);
    const [DepositVaultAddr, setDepositVaultAddr] = useState([]);

    const [showCreate, setShowCreate] = useState([]);
    const [showWithdraw, setShowWithdraw] = useState([]);

    const [listener, setListener] = useState(undefined);   

    // 0 = tipVault     1= tips
    const [menu, setMenu]=useState(0);
  

    const createSplit = async(_name, _receiver)=>{
        // console.log(web3);
      await contracts.vaultMain.methods.createTipVault(_name, _receiver).send({from:userAddr});
      const AllTipVaults = await contracts.vaultMain.methods.getAllTipVaults().call();       
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


  

    const closePopupWithdraw = function(){
      setShowWithdraw(false);
    }

   ///////////////////////// COMPONENTs RENDERER
    const depositComponetRender = function()
    {         
      if (showDeposit===true){
       
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
      if (showCreate===true){
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
      if (showWithdraw===true){
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
        await contracts.vaultMain.methods.retireTips(tipVaultAddr).send({from:userAddr});       
        closePopupDepo(); 
         
      }catch(e){
          alert('error withdraw !  '  +  e);
      }   
}
   
    const deposit= async(tipVaultAddr,amount)=>{   
      setDepositVaultAddr(tipVaultAddr);
          try{  
            let weiAmount = web3.utils.toWei(amount);
            await contracts.vaultMain.methods.tip(tipVaultAddr).send({from:userAddr, value:weiAmount});
            closePopupDepo();
                  
          }catch(e){
              alert('error deposit !  '  +  e);
          }   
    }

    const closeSplit = async(tipVaultAddr)=>{
        try{   
          await contracts.vaultMain.methods.closeTipVault(tipVaultAddr).send({from:userAddr});     
         
        }catch(e){
            alert('error closing !'  +  e);
        }   
    }


    
    /*
    <tbody>
    <div className="card"><button className="btn btn-primary disabled" style={boutonMenu} onClick={showCreateCard} >Create SplitVault</button></div>
</tbody>
*/
    const myTipVaultsRenderer= function(){
         
      /// bouton create desactive
        if (web3=='' || web3==undefined)
        {          
              return(           
              ''
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


    const myVaultsRenderer= function(){

      const text= {
        color:"white",
        textAlign:"center", 
        fontSize:20,
        width:"100%"
      }
      if (MyVaults.length===0)
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

   const listenToEvents = (thisComponent)=> {
    //const tradeIds=new Set();
   // setTrades([]);
      const listenerTipVaultCreated = contracts.vaultMain.events.TipVaultCreated({       
        fromBlock: 0
      })
      .on('data',()=>{
       
      });
      //setListener(listenerTipVaultCreated);
      setListener(listener);
  }

  function forceUpdateHandler(){
    this.forceUpdate();
  };
  useEffect(()=>{
    console.log('useEffect :');
    const init = async()=>{
      console.log('web3 :' + web3);
      
   
      setShowDeposit(false);
      setShowCreate(false);
     

      //const rawTokens = await contracts.vaultMain.methods.getTokens().call();
     /* const tokens = rawTokens.map(token=>({
          ...token,
          ticker: web3.utils.hexToUtf8(token.ticker)
      }));           
      
      */
    
     
      // alert(tokens);
    /*  const accounts = await web3.eth.getAccounts(); 
      setAccounts(accounts);   
      alert (accounts);     */ 
    }
    init();
    },[]);


    useEffect(()=>{
      console.log("www  " + web3);
      const update = async()=>{
        if (web3 !='')
        {
          let smartContracts =  await getContracts(web3);
          setContracts(smartContracts);
          
          const acc=accounts[0];
          setUserAddr(acc);
          console.log("app 280  acc: "+ acc);
          console.log(contracts);
          const myTipVaults = await smartContracts.vaultMain.methods.getAllTipVaults().call();  
          setMyTipVaults(myTipVaults);    
          console.log("app 280 : "+ myTipVaults);
          const myTips = await smartContracts.vaultMain.methods.getTipsByOwnerAddr(acc).call();   
          setMyTips(myTips); 
         //listenToEvents();
        }
     }

       update();

    },[accounts]);
  

    const styleBack= {
      color:"white", 
      fontSize:30,
      width:"100%"
   }

   const boutonMenu= {
    color:"white",
    backgroundColor:"#00225520",
    borderColor:"#ffffff",
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
         setWeb3={setWeb3}
         setAccounts={setAccounts}   
         web3={web3}    
       />
        <Row style={paddingRow}>
          <Col className="col-sm-4"></Col>  
          <Col className="col-sm-2"><div ><button id="boutMenuTipVault" className="btn btn-primary" style={boutonMenu} onClick={()=>menuSelectTipVaults()}>TipVaults</button></div></Col>  
          <Col className="col-sm-2"><div ><button id="boutMenuTip" className="btn btn-primary"  style={boutonMenu} onClick={()=>menuSelectTips()}>Tips</button></div></Col> 
          <Col className="col-sm-4"></Col>  
        </Row>
        <Row>
          <Col className="col-sm-2"></Col>
          <Col className="col-sm-8">          
             {menu==0?myTipVaultsRenderer():myVaultsRenderer()}
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

