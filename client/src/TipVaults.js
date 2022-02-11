import React from "react";


function TipVaults({tip_Vaults, title, showDeposit,showCreate, closeSplit,showWithdraw, openSearch}) {

 
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

    const openSearchCard= function(){
      openSearch();
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
    

    return (
      <div id="order-list" className="card">      
    
          <h2 className="card-title">{title}</h2>
          <div><button className="btn btn-primary" onClick={()=>create()}>Create SplitVault</button></div>
          <div><button className="btn btn-primary" onClick={()=>openSearchCard()}>Search SplitVault</button></div>
        
          <hr/>
          <div className="row">
            <div className="col-sm-6">              
            </div>

                <table className={"table table-striped mb-0 order-list"}>
                <thead>       
                <tr key='labels'>
                    
                    <th>Name</th>
                    <th>Owner</th>
                    <th>TotalAmount</th>
                    <th>open</th>
                </tr>
                </thead>        
                <tbody>
                { tip_Vaults.map((tip) =>
                (<tr key={tip.id} >                     
                      <td>{tip.name}</td>
                       <td>{tip.from}</td>
                       <td>{tip.totalAmount}</td>                       
                       <td>{tip.isOpen===true?'open':'closed'}</td>                           
                       <td><div> <button className="btn btn-primary" onClick={()=>deposit(tip.addr)}>Deposit</button></div></td>
                       
                       <td>{htmlButtonCloseSplit(tip)}</td>      

                     </tr>					   
                  ))}               

                </tbody>  
              </table>
          </div>
      </div>
        
      );
}

export default TipVaults;