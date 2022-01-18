import React from 'react';



function Header({
    userAddr  
}){
    return(
      <header id="header" className="card">
      <div className="row">
          <div className="col-sm-3 flex">
         </div>
      </div>
      <div className="col-sm-9">
                    <h1 className="header-title">
                    {userAddr}
                    </h1>
        </div>
        
</header>
    );
}

export default Header;