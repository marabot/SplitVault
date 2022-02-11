import React, { useState, useEffect } from 'react';
import { getWeb3, getContracts } from './utils.js';
import App from './App.js';
import Container from 'react-bootstrap/Container';


const styleTitreBack= {
    textAlign:"center",
    padding:"100px",
    color:'white',
    fontSize:"30px",
    
}

function LoadingContainer(){
    const [web3, setWeb3] = useState(undefined);
    const [accounts, setAccounts] = useState([]);
    const [contracts, setContracts] = useState(undefined);


    useEffect(()=>{
            const init =async()=>{
                alert('here?');
                const web3 = await getWeb3();
                alert('here2?');
                const networkId = await web3.eth.net.getId();
                alert('net '+networkId);
                if (networkId=='5777')
                {
                    alert('here 2.1 ?');
                    const contracts = await getContracts(web3);
                    setContracts(contracts);                    
                }
                
                alert('here 3 ?');
                const accounts = await web3.eth.getAccounts();
                setWeb3(web3);       
                setAccounts(accounts);             
            }
            init();

    }, []);

   

    const isReady = ()=>{
        return (                
             typeof web3 !== 'undefined'
             && typeof contracts !=='undefined' 
             && accounts.length >0           
        );
    }

   
    if (!isReady()){
      
        return <div style={styleTitreBack}>Loading...  (check you are on the right network)</div>;
    }

   
    
    

    return(    
        <Container fluid >
            <div className='row'>  <App    
                        web3={web3}            
                        contracts= {contracts} 
                        accounts={accounts}       
                    /></div>
          
                
                
           
        </Container>
       
    );
}

export default LoadingContainer;