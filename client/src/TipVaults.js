import React from "react";


function TipVaults({tip_Vaults, title, showDeposit,showCreate, closeSplit,withDraw, addrUser}) {
    //alert('tip => ' + tip_Vaults[0].endTime + '---' + Date.now());
  
    const deposit = function(addr) {
     
      showDeposit(addr);
    };

    const withdraw = function(id) {
      withDraw(id);
    }

    const create = function() {
      showCreate();
    }
/*
    const closeSplit= function(id){
      closeSplit(id);
    }*/
    const boutDepositRender= function(tip){
      if(tip.endTime > Date.now()/1000)
      {
        return (
          <button className="btn btn-primary" onClick={()=>deposit(tip.addr)}>Deposit</button>
        )

      }else
      {
        return (
          <button className="btn btn-primary disabled" >Closed</button>
        )
      }
    }

    const htmlButtonCloseSplit= function(tip){

     if(tip.from == addrUser) {      
        if(tip.endTime > Date.now()/1000){
          return(
            <div> <button className="btn btn-primary" onClick={()=>closeSplit(tip.addr)}>Close</button></div>
          )
        }else if(tip.endTime==1)
        {
          return(
          <div> <button className="btn btn-primary" onClick={()=>withdraw(tip.addr)}>WithDraw</button></div>
          )
        }else
        {
          return(
            <div> <button className="btn btn-primary disabled"> Delivered </button></div>
            )
        }
      }
    }
    
    function displayTipVaulCard(tip){
        const amountNotWei = tip.totalAmount/ Math.pow(10,18);
        
        
        return (
            <div style={tipVaultCard}>
              <div style={label} >Name</div>
              <div>{tip.name}</div>

              <div style={label}>From</div>
              <div style={adressStye}>{tip.from}</div>

              <div style={label}>Receiver</div>
              <div style={adressStye}>{tip.receiver}</div>
            
              <div style={labelTotalAmount}>Total amount</div>
              <div  >{amountNotWei}</div>
              <div style={boutDeposit}>{boutDepositRender(tip)}</div>
              {htmlButtonCloseSplit(tip)}
            </div>

        );
    }

    const tipVaultCard={
      backgroundColor: 'rgb(20, 20, 20,00)',
      borderRadius: '10px',
      border: '4px solid black',
      padding:'20px',
      marginBottom: '1em',
      color: 'white'

    }

    const label= {
        textAlign:"left",
        paddingTop:"7px",      
        fontSize:"18px",      
    }

    const labelTotalAmount= {
      textAlign:"left",
      paddingTop:"7px",      
      fontSize:"20px",      
  }

    const boutDeposit= {
        textAlign:"center",
        fontSize:"8px",      
    }

    const adressStye= {
      textAlign:"left",    
      fontSize:"18px"     
  }

    return (
      <div id="order-list" className="card">      
    
          <h2 className="card-title">{title}</h2>
          <div><button className="btn btn-primary" onClick={()=>create()}>Create SplitVault</button></div>         
          <hr/>
          <div className="row">
            <div className="col-sm-6">              
            </div>

                <table className={"table table-striped mb-0 order-list"}>
                <thead>       
              
                </thead>        
                <tbody>
                { tip_Vaults.map((tip) =>
                (
                  <div>
                    {displayTipVaulCard(tip)}
                  </div>
             
                  ))}               

                </tbody>  
              </table>
          </div>
      </div>
        
      );
}

export default TipVaults;