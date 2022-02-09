pragma solidity 0.8.0;

import '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import './libraries/VaultStruct.sol';


contract TipVault{

        // Bags by owner
        mapping(address => Bag) Bags;
        
        bool isOpen;
        string name;
        uint totalAmount;  

        address[] bagsOwnersList;
        
        // Tokens
        mapping(bytes32 => Token) public tokens;
        bytes32[] public tokenList;

        struct Token {
            bytes32 ticker;
            address tokenAddress;
        }
        
        uint oneWei= 1 wei;

        address admin;       

        // part en 1/1000 (10% => 100)
        struct Bag{    
            address from;                
            uint amount;                              
        }        

        struct tipVaultStruct {
            address addr;
            string name;
            address from;
            uint totalAmount;
            bool isOpen;
        }
    
        ////////// CONSTRUCTOR ////////////
        constructor(string memory _name, address _from,bytes32[] memory  _tokensTickers, address[] memory _tokensAddress ){
            for(uint i=0;i<_tokensTickers.length;i++)
            {                
                 tokens[_tokensTickers[i]] = Token(_tokensTickers[i], _tokensAddress[i]);
                 tokenList.push(_tokensTickers[i]);               
            }
            admin= _from; 
            isOpen=true;    
            name = _name;              
        }
        
        function deposit(uint _amount, address _sender, bytes32 _tokenTicker) external payable  returns (uint)   {
             
            require(isOpen==true,'l inscription a ce splitVault est cloture');

             ///  try catch à faire 
            IERC20(tokens[_tokenTicker].tokenAddress).transferFrom(
                    _sender,
                    address(this),
                    _amount
                    );

            // si 1er dépôt
            if (Bags[_sender].from==address(0x0))
            {
                bagsOwnersList.push(_sender);
                Bags[_sender] = Bag(_sender,_amount);  
            }
            //si a déjà un dépot
            else
            {
                Bag storage ownerbag = Bags[_sender];
                ownerbag.amount += _amount; 
            }
            totalAmount+=_amount;          
         
            return 1;
        }        


        function getBag() external view returns (Bag memory){
                return Bags[msg.sender];
        }



        function retire(address _to, address _sender) external onlyFromAdmin(_sender)  {   

                    IERC20(tokens[tokenList[0]].tokenAddress).transfer(                   
                    _to,
                    totalAmount
                    );                    
         }               
        


        function close(address _sender) external payable onlyFromAdmin(_sender) {   
            require(isOpen==true,'l inscription a ce splitVault est deja cloture');
                    
            isOpen =false;  
                    
        }

        function getTokens() 
            external 
            view 
            returns(Token[] memory) {
            Token[] memory _tokens = new Token[](tokenList.length);
            for (uint i = 0; i < tokenList.length; i++) {
                _tokens[i] = Token(
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
            tokens[ticker] = Token(ticker, tokenAddress);
            tokenList.push(ticker);
        }

        
        function getAllBags() external view returns(Bag[] memory) {      
           Bag[] memory ret = new Bag[](bagsOwnersList.length);
           for (uint i;i<bagsOwnersList.length;i++)
                {
                    ret[i] = Bags[bagsOwnersList[i]];
                }
            return ret;
        }

        

        function getTipVaultStruct() external view returns(VaultStruct.tipVaultStruct memory){
            return VaultStruct.tipVaultStruct(address(this),  name, admin, totalAmount, isOpen );

        }
        
        function getTotalAmountsplitVault() public view returns(uint){
            uint ret=0;
             for (uint i;i<bagsOwnersList.length;i++)
                {
                    ret += Bags[bagsOwnersList[i]].amount;
                }
            return ret;
        }

        function isSplitOpen() external view returns(bool){
         return isOpen;   
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