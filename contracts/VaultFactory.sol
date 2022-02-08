pragma solidity 0.8.0;

import '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import './SplitVault.sol';
import './TipVault.sol';

contract VaultFactory{
        
        //Splits & Vaults par owner
           // Tokens
        mapping(bytes32 => Token) public tokens;
        bytes32[] public tokenList;

        address admin;
        struct Token {
            bytes32 ticker;
            address tokenAddress;
        }

        constructor(){  
            admin= msg.sender;                    
        }

       function createSplitVault(string memory _name) external returns(SplitVault){
                    
            bytes32[] memory tokensTickers = new bytes32[](tokenList.length);
            address[] memory tokensAddress = new address[](tokenList.length);
            for (uint i = 0; i < tokenList.length; i++) {
                tokensTickers[i] = tokenList[i];
                tokensAddress[i] = tokens[tokenList[i]].tokenAddress;               
            }
        
            return ( new SplitVault(_name,address(0x60aE616a2155Ee3d9A68541Ba4544862310933d4), tokensTickers,tokensAddress));
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

        
        modifier onlyAdmin() {
            require(msg.sender == admin, 'only admin');
            _;
        }
}
