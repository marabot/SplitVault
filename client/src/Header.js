import React from 'react';


const styleMenuBack= {
    color:"white",  
    fontSize:30,
    background:"linear-gradient(135deg,#22330e80,#ba974550)",
    
}


function Header({
    userAddr  
}){
    return(
      <div id="header"  style={styleMenuBack}>
     
     
                    <h1 className="header-title">
                    {userAddr}
                    </h1>
        
        
        </div>
    );
}

export default Header;