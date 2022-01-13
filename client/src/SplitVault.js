import React from "react";


function SplitBags({allSplits, title, showDeposit,showCreate, closeSplit,showWithdraw, openSearch}) {

   
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
                    <th>id</th>
                    <th>Name</th>
                    <th>Owner</th>
                    <th>TotalAmount</th>
                    <th>open</th>
                </tr>
                </thead>        
                <tbody>
                {allSplits.map((split) =>(
                     <tr key={split.id} >
                       <td>{split.splitId}</td>
                       <td>{split.name}</td>
                       <td></td>
                       <td>{split.totalAmount}</td>                       
                       <td>{split.open===true?'open':'closed'}</td>                           
                       <td><div> <button className="btn btn-primary" onClick={()=>deposit(split.splitId)}>Deposit</button></div></td>
                       
                       <td>{htmlButtonCloseSplit(split)}</td>                 
                     </tr>
                  ))}               

                </tbody>  
            </table>
          </div>
        </div>
        
      );
}

export default SplitBags;