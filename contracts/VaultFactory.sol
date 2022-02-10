pragma solidity 0.8.0;

import '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import './TipVault.sol';
import './libraries/VaultStruct.sol';

contract VaultFactory{
        
        //Splits & Vaults par owner
           // Tokens
        mapping(bytes32 => VaultStruct.Token) public tokens;
        bytes32[] public tokenList;

        address admin;
        
        constructor(){  
            admin= msg.sender;                    
        }

      
       

        function createTipVault(string memory _name, address _from) external returns(TipVault){
            bytes32[] memory tokensTickers = new bytes32[](tokenList.length);
            address[] memory tokensAddress = new address[](tokenList.length);
            for (uint i = 0; i < tokenList.length; i++) {
                tokensTickers[i] = tokenList[i];
                tokensAddress[i] = tokens[tokenList[i]].tokenAddress;               
            }
        
            return (new TipVault(_name,_from, tokensTickers,tokensAddress));
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

        
        modifier onlyAdmin() {
            require(msg.sender == admin, 'only admin');
            _;
        }
}
