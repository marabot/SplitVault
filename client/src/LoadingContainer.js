import React, { useState, useEffect } from 'react';
import { getWeb3, getContracts } from './utils.js';
import App from './App.js';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

function LoadingContainer(){
    const [web3, setWeb3] = useState(undefined);
    const [accounts, setAccounts] = useState([]);
    const [contracts, setContracts] = useState(undefined);

    useEffect(()=>{
            const init =async()=>{
                const web3 = await getWeb3();
                const contracts = await getContracts(web3);
                const accounts = await web3.eth.getAccounts();
                setWeb3(web3);                
                setContracts(contracts);   
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
        return <div>Loading...</div>;
    }

    return(    
        <Container fluid>
            <Row>
                <Col className="col-sm-1"> </Col>
                <Col className="col-sm-9"> <App    
                        web3={web3}            
                        contracts= {contracts} 
                        accounts={accounts}       
                    />
                </Col>
                <Col className="col-sm-1" > </Col>
            </Row>
        </Container>
       
    );
}

export default LoadingContainer;