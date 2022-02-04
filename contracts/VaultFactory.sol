pragma solidity 0.8.0;

import '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import './SplitVault.sol';

contract VaultFactory{
        
        //Splits & Vaults par owner
        mapping(address=> address[]) splitVaultsByOwner;
        mapping(address=> address[]) bagsByUser;  
        mapping(address =>SplitVault) splitVaultByAddr;
        SplitVault[] allSplitVaults;
     
        uint ownerCount;
        uint userCount;
        
       
        uint oneWei= 1 wei;

        address admin;
        address bnbAddress= 0xB8c77482e45F1F44dE1745F52C74426C631bDD52;
       
        // Tokens
        mapping(bytes32 => Token) public tokens;
        bytes32[] public tokenList;

        struct Token {
            bytes32 ticker;
            address tokenAddress;
        }

        constructor( ){
            admin= msg.sender;           
        }

        function createSplitVault(string memory _name) payable external returns(address){  
                    
            bytes32[] memory tokensTickers = new bytes32[](tokenList.length);
            address[] memory tokensAddress = new address[](tokenList.length);
            for (uint i = 0; i < tokenList.length; i++) {
                tokensTickers[i] = tokenList[i];
                tokensAddress[i] = tokens[tokenList[i]].tokenAddress;               
            }
        
            SplitVault newSplit= new SplitVault(_name, tokensTickers,tokensAddress);

            address[] storage sp = splitVaultsByOwner[msg.sender];
            sp.push(address(newSplit));

            splitVaultByAddr[address(newSplit)] = newSplit;
            allSplitVaults.push(newSplit);
            
            return address(newSplit);
        }

        function deposit(uint _amount, address _splitContract) payable external 
        {
            SplitVault sp = splitVaultByAddr[_splitContract];
            require(sp.getAdmin()==msg.sender, 'Vous n etes pas le createur du splitvault')
            
            sp.deposit(_amount, msg.sender);

        }

        function closeSplitVault(address _splitAddr) external payable     {
              SplitVault sp = splitVaultByAddr[_splitAddr];
              sp.closeSubSplitVault(msg.sender);  
            
        }        

        function retire(uint _amount, address _splitContract) external payable  {
             SplitVault sp = splitVaultByAddr[_splitContract];
             sp.retire(_amount);
            
        }



        function getAllSplitVaults() external view returns (address[] memory){
           address[] memory  ret = new address[](allSplitVaults.length);

           for(uint i =0 ;i<allSplitVaults.length;i++)
           {
               ret[i]=address(allSplitVaults[i]);
           }

            return ret;
        }

        function getSenderSplitVaults() external view returns (address[] memory){
            return splitVaultsByOwner[msg.sender];
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

    
        function addToken(
            bytes32 ticker,
            address tokenAddress)
            onlyAdmin()
            external {
            tokens[ticker] = Token(ticker, tokenAddress);
            tokenList.push(ticker);
        }

        function string_tobytes( string memory  s) internal pure  returns (bytes memory ){
            bytes memory b3 = bytes(s);
            return b3;
        }


        
        modifier onlyAdmin() {
            require(msg.sender == admin, 'only admin');
            _;
        }
}pragma solidity 0.8.0;
