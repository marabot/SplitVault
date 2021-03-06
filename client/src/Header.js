import React, {useState, useEffect} from "react";
import Web3 from 'web3';
import Web3Modal from "web3modal";
import WalletConnectProvider from '@walletconnect/web3-provider';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';


function Header({
     web3_2, setWeb3, setAccounts
}){

    
    //const EvmChains = window.EvmChains;

    // Web3modal instance
    let web3Modal;
    
    // Chosen wallet provider given by the dialog window
    let provider;
    
    // Address of the selected account
    let selectedAccount;

    let web3;

    function init() {

        console.log("Initializing example");
        console.log("WalletConnectProvider is", WalletConnectProvider);
        
      
        // Tell Web3modal what providers we have available.
        // Built-in web browser provider (only one can exist as a time)
        // like MetaMask, Brave or Opera is added automatically by Web3modal
        const providerOptions = {
         /* walletconnect: {
            package: WalletConnectProvider,
            options: {
              // Mikko's test key - don't copy as your mileage may vary
              infuraId: "3198ac3a6fb44350a28522ea60608de7",
            }
          },*/
        };
      
        web3Modal = new Web3Modal({
          cacheProvider: false, // optional
          providerOptions, // required
        });      
      }
      
      async function fetchAccountData() {
    
        // Get a Web3 instance for the wallet
       // const web3 = new Web3(provider);       
       if (window.ethereum) {
        web3 = new Web3(window.ethereum);   
        setWeb3(web3);     
        await window.ethereum.enable(); 
       
      }
      // Legacy dapp browsers...
      else if (window.web3) {
        // Use Mist/MetaMask's provider.
        web3 = window.web3;
        setWeb3(web3);
        console.log("Injected web3 detected.");
       
      }
      // Fallback to localhost; use dev console port by default...
      else {
        const provider = new Web3.providers.HttpProvider(
          "http://localhost:9545"
        );
        web3 = new Web3(provider);
        console.log("No web3 instance injected, using Local web3.");
        setWeb3(web3);
       
      }
      
        const accounts = await web3.eth.getAccounts();
        setAccounts(accounts);
        
        console.log("Web3 instance is", web3);
      
        // Get connected chain id from Ethereum node
        const chainId = await web3.eth.getChainId();
        console.log(chainId);
        // Load chain information over an HTTP API
       if (chainId==1)
       {
        document.querySelector("#network-name").textContent = "Ethereum MainNet";
       }else if (chainId==1337){
        document.querySelector("#network-name").textContent = "Truffle Local";
       }       
       else{
        document.querySelector("#network-name").textContent = "plz connect to Ethereum network";
       }
       /* const chainData =  EvmChains.getChain(chainId);
       
        document.querySelector("#network-name").textContent = chainData.name;
      */
        // Get list of accounts of the connected wallet
      
        // MetaMask does not give you all accounts, only the selected account
        console.log("Got accounts", accounts);
        selectedAccount = accounts[0];
        
        selectedAccount=accounts[0].substring(0,5)+ "..." + accounts[0].substring(accounts[0].length-3)
        document.querySelector("#selected-account").textContent = selectedAccount;
      /*
        // Get a handl
        const template = document.querySelector("#template-balance");
        const accountContainer = document.querySelector("#accounts");
      
        // Purge UI elements any previously loaded accounts
        accountContainer.innerHTML = '';
      
        // Go through all accounts and get their ETH balance
        const rowResolvers = accounts.map(async (address) => {
          const balance = await web3.eth.getBalance(address);
          // ethBalance is a BigNumber instance
          // https://github.com/indutny/bn.js/
          const ethBalance = web3.utils.fromWei(balance, "ether");
          const humanFriendlyBalance = parseFloat(ethBalance).toFixed(4);
          // Fill in the templated row and put in the document
          const clone = template.content.cloneNode(true);
          clone.querySelector(".address").textContent = address;
          clone.querySelector(".balance").textContent = humanFriendlyBalance;
          accountContainer.appendChild(clone);
        });
      
        // Because rendering account does its own RPC commucation
        // with Ethereum node, we do not want to display any results
        // until data for all accounts is loaded
        await Promise.all(rowResolvers);
      */
        // Display fully loaded UI for wallet data
        document.querySelector("#prepare").style.display = "none";
        document.querySelector("#connected").style.display = "block";
      }
    
      async function refreshAccountData() {
    
        // If any current data is displayed when
        // the user is switching acounts in the wallet
        // immediate hide this data
        document.querySelector("#connected").style.display = "none";
        document.querySelector("#prepare").style.display = "block";
      
        // Disable button while UI is loading.
        // fetchAccountData() will take a while as it communicates
        // with Ethereum node via JSON-RPC and loads chain data
        // over an API call.
        document.querySelector("#btn-connect").setAttribute("disabled", "disabled")
        await fetchAccountData(provider);
        document.querySelector("#btn-connect").removeAttribute("disabled")
      }
      
    
      async function onConnect() {
    
        console.log("Opening a dialog", web3Modal);
        try {
          provider = await web3Modal.connect();
        } catch(e) {
          console.log("Could not get a wallet connection", e);
          return;
        }
      
        // Subscribe to accounts change
        provider.on("accountsChanged", (accounts) => {
          fetchAccountData();
        });
      
        // Subscribe to chainId change
        provider.on("chainChanged", (chainId) => {
          fetchAccountData();
        });
      
        // Subscribe to networkId change
        provider.on("networkChanged", (networkId) => {
          fetchAccountData();
        });
      
        await refreshAccountData();
      }
    
      async function onDisconnect() {
    
        console.log("Killing the wallet connection", provider);
      
        // TODO: Which providers have close method?
        if(provider.close) {
          await provider.close();
      
          // If the cached provider is not cleared,
          // WalletConnect will default to the existing session
          // and does not allow to re-scan the QR code with a new wallet.
          // Depending on your use case you may want or want not his behavir.
          await web3Modal.clearCachedProvider();
          provider = null;
        }
      
        selectedAccount = null;
      
        // Set the UI back to the initial state
        document.querySelector("#prepare").style.display = "block";
        document.querySelector("#connected").style.display = "none";

        setWeb3([]);
        setAccounts([]);
      }
      
    window.addEventListener('DOMContentLoaded', async () => {
      init();
      document.querySelector("#btn-connect").addEventListener("click", onConnect);
      document.querySelector("#btn-disconnect").addEventListener("click", onDisconnect);
    });

    const displayNone={
        display :"none"
    }


    const styleMenuBack= {
      color:"white",  
      fontSize:30,
      background:"linear-gradient(135deg,#555555,#777777)",
      height:"100px"
      
  }
  
  const styleAddr= {
      textAlign:"right",
      paddingRight:"15px",
      fontSize:"20px",
      borderColor:"black",
      borderSize:"3"
  }
  
  
  const styleTitreBack= {
      color:"white",
      textAlign:"left",
      padding:"20px",
      paddingLeft:"50px",
      fontSize:"50px",
      
  }

  const boutonMenu= {
    color:"white",
    backgroundColor:"#00225520",
    paddingRight:"15px",
    borderColor:"#ffffff",
    fontSize:15,
    width:"150px",
    borderRadius: "20px"
 }

 const transparent={
    backgroundColor:"#00000000"

 }

 const wrongNetworkMess={
    fontSize:15,
    paddingRight:"15px",

 }
  /*
   // infos web3
   <div id="accounts">  </div>
 
  */

   useEffect(()=>{
     /*
      if (web3_2==undefined) console.log("gagaehahaeg");
      if (web3_2!=undefined) onConnect();
    */
    
    init();
    },[]);



    return(    
        <diV>          
            <Row>
              <Col className="col-sm-8"> 
              <div style={styleTitreBack}>
                            <div className="header-title" style={styleTitreBack}>
                                    TipVaults
                            </div>
                        </div> 
              </Col>
              <Col className="col-sm-4" > 
              
                  <div   style={transparent} className="text-right">   
                   <div id="prepare" >
                      <button id="btn-connect" style={boutonMenu}> connect</button>
                  </div>
                  <div id="connected" style={displayNone}>
                      <div id="header" >    
                        <button id="btn-disconnect"  style={boutonMenu}> disconnect</button>
                                    <div  style={styleAddr} id='selected-account'>   </div>
                                    <div id="network-name" style={wrongNetworkMess}></div>
                        </div>
                    </div>
                  </div> 
    
               </Col>
            </Row>    
        </diV>
    );
}

export default Header;