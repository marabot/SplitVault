import React, {useState, useEffect} from "react";


function Deposit({bagId, deposit, closePopupDepo, web3}) {

   const [amount , setAmount]=useState(0);

   const onHandleAmountChange = function(e) {
    let val = e.target.value;

        if (!Number(val) && val!='') {
            return;
        }
        setAmount(val);
    }

    const depositCall = async()=>{   
      //let weiAmount= web3.utils.toGWei(amount, 'ether');
        await deposit(amount);
    };

    const closePopup = function(){
      closePopupDepo();
    }

    useEffect(()=>{
        const init = async()=>{
        setAmount('');
        }
        
        init();
        },[]);

    return (
        <div id="newSplit" className="card popup">
        <div className="closeCross" onClick={closePopup}>X</div>
        <h2 className="card-title">Deposit for {bagId}</h2>   

          <div className="form-group row">
            <label className="col-sm-4 col-form-label" htmlFor="order-amount">Amount</label>
            <div className="col-sm-8">
              <input 
                value={amount}
                type="text" 
                className="form-control" 
                id="name"
                onChange= {e=>onHandleAmountChange(e)}       
              />
            </div>
          </div>         
          
          <div className="text-right">
             <button className="btn btn-primary" onClick={depositCall} >Deposit</button>
          </div>       
        
      </div>
        
      );
}

export default Deposit;