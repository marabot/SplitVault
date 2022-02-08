pragma solidity 0.8.0;

import '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import './VaultFactory.sol';

contract VaultMain{
        
        //Splits & Vaults par owner
        mapping(address=> address[]) VaultsByOwner;
        mapping(address=> address[]) bagsByUser;  
        mapping(address=> address[]) tipsByUser;  
        mapping(address =>SplitVault) splitVaultByAddr;
        mapping(address =>TipVault) tipVaultByAddr;
        SplitVault[] allSplitVaults;
        TipVault[] allTipVaults;
     
        uint ownerCount;
        uint userCount;        
       
        uint oneWei= 1 wei;
        address admin;       
       
        VaultFactory VFactory;
        // Tokens
        mapping(bytes32 => Token) public tokens;
        bytes32[] public tokenList;

        struct Token {
            bytes32 ticker;
            address tokenAddress;
        }

        constructor(VaultFactory _vf){
            admin= msg.sender;      
            VFactory=_vf;    
        }

        function createSplitVault(string memory _name) payable external returns(address){                                
        
            SplitVault newSplit= VFactory.createSplitVault(_name);

            address[] storage sp = VaultsByOwner[msg.sender];
            sp.push(address(newSplit));

            splitVaultByAddr[address(newSplit)] = newSplit;
            allSplitVaults.push(newSplit);
            
            return address(newSplit);
        }

        function createTipVault(string memory _name) payable external returns(address){  
             
        
            TipVault newTipV= VFactory.createTipVault(_name, msg.sender);

            address[] storage tp = VaultsByOwner[msg.sender];
            tp.push(address(newTipV));

            tipVaultByAddr[address(newTipV)] = newTipV;
            allTipVaults.push(newTipV);
            
            return address(newTipV);
        }


        function tip(uint _amount, address _splitContract) payable external 
        {             
            tipVaultByAddr[_splitContract].deposit(_amount, msg.sender, 'DAI');
        }

        function retireTips(address _splitContract, address _to) external payable  {
             tipVaultByAddr[_splitContract].retire(_to, msg.sender);           
                       
        }


        function deposit(uint _amount, address _splitContract) payable external 
        {             
            splitVaultByAddr[_splitContract].deposit(_amount, msg.sender);
        }

        function closeTipVault(address _splitAddr) external payable     {
              tipVaultByAddr[_splitAddr].close(msg.sender);               
            
        }        

        function closeSplitVault(address _splitAddr) external payable     {
              SplitVault sp = splitVaultByAddr[_splitAddr];
              require(sp.getAdmin()==msg.sender, 'pas votre splitvault');
              sp.closeSubSplitVault();  
            
        }        

        function retire(uint _amount, address _splitContract) external payable  {
             SplitVault sp = splitVaultByAddr[_splitContract];
             require(sp.getAdmin()==msg.sender, 'pas votre splitvault');
             sp.retire(_amount);            
        }


        function getAllTipVaults() external view returns (address[] memory){
           address[] memory  ret = new address[](allTipVaults.length);

           for(uint i =0 ;i<allTipVaults.length;i++)
           {
               ret[i]=address(allTipVaults[i]);
           }
            return ret;
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
            return VaultsByOwner[msg.sender];
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
}
