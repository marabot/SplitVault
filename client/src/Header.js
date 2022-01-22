import React from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

const styleMenuBack= {
    color:"white",  
    fontSize:30,
    background:"linear-gradient(135deg,#170F34,#170F34)",
    height:"100px"
    
}

const styleAddr= {
    textAlign:"center",
    padding:"25px",
    fontSize:"20px"
}


const styleTitreBack= {
    textAlign:"left",
    padding:"20px",
    paddingLeft:"50px",
    fontSize:"50px",
    
}

function Header({
    userAddr  
}){
    return(
        <diV>          
            <Row>
                    <Col className="col-sm-8">                        
                        <div style={styleTitreBack}>
                            <div className="header-title" style={styleTitreBack}>
                                    SplitVaults
                            </div>
                        </div>
                    </Col>
                    <Col className="col-sm-4">
                        <div id="header"  style={styleMenuBack}>   
                                    <div className="header-title" style={styleAddr}>
                                        {userAddr}
                                </div>    
                        </div>
                    </Col>
            </Row>    
        </diV>
     
    );
}

export default Header;