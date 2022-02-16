pragma solidity 0.8.0;

import '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import './libraries/VaultStruct.sol';


contract TipVault{

        // Tips by owner
        mapping(address => VaultStruct.Tip) Tips;
        
        uint endTime;
        string name;
        uint totalAmount;  
        uint id;
        address[] tipsOwnersList;
        
        // Tokens
        mapping(bytes32 => VaultStruct.Token) public tokens;
        bytes32[] public tokenList;

        struct Token {
            bytes32 ticker;
            address tokenAddress;
        }      

        address admin;       

    
        ////////// CONSTRUCTOR ////////////
        constructor(uint _id,string memory _name, address _from,bytes32[] memory  _tokensTickers, address[] memory _tokensAddress, uint _endTime ){
            for(uint i=0;i<_tokensTickers.length;i++)
            {                
                 tokens[_tokensTickers[i]] = VaultStruct.Token(_tokensTickers[i], _tokensAddress[i]);
                 tokenList.push(_tokensTickers[i]);               
            }
            admin= _from; 
            endTime=_endTime;    
            name = _name; 
            id=_id;             
        }
        
        function deposit(uint _amount, address _sender, bytes32 _tokenTicker) external payable   {
          
            require(endTime > block.timestamp,'l inscription a ce splitVault est cloture');

            /*
             ///  try catch à faire 
            IERC20(tokens[_tokenTicker].tokenAddress).transferFrom(
                    _sender,
                    address(this),
                    _amount
                    );
*/
            // si 1er dépôt
            if (Tips[_sender].from==address(0x0))
            {
                tipsOwnersList.push(_sender);
                Tips[_sender] = VaultStruct.Tip(_sender,address(this),_amount);  
            }
            //si a déjà un dépot
            else
            {
                VaultStruct.Tip storage ownerTip = Tips[_sender];
                ownerTip.amount +=  _amount; 
            }
            totalAmount+= _amount;               
        }        


        function getTipStructOfUser(address _tipOwner) external view returns (VaultStruct.Tip memory){
                return Tips[_tipOwner];
        }

        function getBalance()external view returns (uint){
            return address(this).balance;

        }

        function retire(address payable _to, address _sender) external onlyFromAdmin(_sender)  {   
                   
                   
                     _to.call{value:totalAmount}("");
                      totalAmount=0;
                   /* IERC20(tokens[tokenList[0]].tokenAddress).transfer(                   
                    _to,
                    toRetire
                    ); */                   
         }               
        

        function close(address _sender) external payable onlyFromAdmin(_sender) {   
            require(endTime > block.timestamp,'l inscription a ce splitVault est deja cloture');
                    
            endTime = 1;                      
        }

        function getTokens() 
            external 
            view 
            returns(VaultStruct.Token[] memory) {
            VaultStruct.Token[] memory _tokens = new VaultStruct.Token[](tokenList.length);
            for (uint i = 0; i < tokenList.length; i++) {
                _tokens[i] = VaultStruct.Token(
                tokens[tokenList[i]].ticker,
                tokens[tokenList[i]].tokenAddress
                );
            }
            return _tokens;
        }
    
        function addToken (
            bytes32 ticker,
            address tokenAddress)
            onlyAdmin()
            external {
            tokens[ticker] = VaultStruct.Token(ticker, tokenAddress);
            tokenList.push(ticker);
        }

        
        function getAllTips() external view returns(VaultStruct.Tip[] memory) {      
           VaultStruct.Tip[] memory ret = new VaultStruct.Tip[](tipsOwnersList.length);
           for (uint i;i<tipsOwnersList.length;i++)
                {
                    ret[i] = Tips[tipsOwnersList[i]];
                }
            return ret;
        }

        fallback() external payable {}
        

        function getTipVaultStruct() external view returns(VaultStruct.tipVaultStruct memory){
            return VaultStruct.tipVaultStruct(id,address(this),  name, admin, totalAmount, endTime );

        }
        
        function getTotalAmountsplitVault() external view returns(uint){
            uint ret=0;
             for (uint i;i<tipsOwnersList.length;i++)
                {
                    ret = ret + Tips[tipsOwnersList[i]].amount;
                }
            return ret;
        }

        function isSplitOpen() external view returns(bool){
         return endTime > block.timestamp;   
        }

        modifier tokenExist(bytes32 ticker) {
            require(
                tokens[ticker].tokenAddress != address(0),
                'this token does not exist'
            );
        _;
        }
        
        function getAdmin() external view returns (address )
        {
            return admin;

        }

        modifier onlyFromAdmin(address _from) {
            require(_from == admin, 'only admin');
            _;
        }
        modifier onlyAdmin() {
            require(msg.sender == admin, 'only admin');
            _;
        }

}