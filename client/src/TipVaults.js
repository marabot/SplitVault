import React from "react";


function TipVaults({tip_Vaults, title, showDeposit,showCreate, closeSplit,showWithdraw}) {
    //alert('tip => ' + tip_Vaults[0].endTime + '---' + Date.now());
  
    const deposit = function(id) {
      showDeposit(id);
    };

    const withdraw = function(id) {
      showWithdraw(id);
    }

    const create = function() {
      showCreate();
    }

    const close= function(id){
      closeSplit(id);
    }


    const htmlButtonCloseSplit= function(split){
      if(split.open===true){
        return(
          <div> <button className="btn btn-primary" onClick={()=>close(split.splitId)}>Close</button></div>
        )
      }else
      {
        return(
        <div> <button className="btn btn-primary" onClick={()=>withdraw(split.splitId)}>WithDraw</button></div>
        )
      }
    }
    
    function displayTipVaulCard(tip){
        return (
            <div style={tipVaultCard}>
              <div style={label} >Name</div>
              <div>{tip.name}</div>

              <div style={label}>From</div>
              <div style={adressStye}>{tip.from}</div>
            
              <div style={labelTotalAmount}>Total amount</div>
              <div  >{tip.totalAmount}</div>
              <div style={boutDeposit}> <button className="btn btn-primary" onClick={()=>deposit(tip.addr)}>Deposit</button></div>    
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
        fontSize:"10px",      
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