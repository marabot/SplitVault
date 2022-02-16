pragma solidity 0.8.0;

import '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import './VaultFactory.sol';
import './libraries/VaultStruct.sol';

contract VaultMain{
        
        //Splits & Vaults par owner
      
        mapping(address=> address[]) tipVaultsByOwner;
        mapping(address=> address[]) bagsByUser;  
        mapping(address=> address[]) tipsByUser;  
    
        mapping(address =>TipVault) tipVaultByAddr;
 
        TipVault[] allTipVaults;
     
                            
        address admin;       
       
        VaultFactory VFactory;
        // Tokens
        mapping(bytes32 => VaultStruct.Token) public tokens;
        bytes32[] public tokenList;

        
        constructor(VaultFactory _vf){
            admin= msg.sender;      
            VFactory=_vf;    
        }

        function createTipVault(string memory _name) payable external returns(address){               
        
            TipVault newTipV= VFactory.createTipVault(_name, msg.sender);

            address[] storage tp = tipVaultsByOwner[msg.sender];
            tp.push(address(newTipV));

            tipVaultByAddr[address(newTipV)] = newTipV;
            allTipVaults.push(newTipV);
            
            return address(newTipV);
        }


        function tip(uint _amount, address payable _splitContract) payable external 
        {             
            require(msg.value == _amount,"pas assez de e-moula");
            _splitContract.call{value:_amount}("");
            tipVaultByAddr[_splitContract].deposit(_amount, msg.sender, 'DAI' );
            
        }

        function retireTips(address _splitContract, address payable _to) external payable  {
            tipVaultByAddr[_splitContract].retire(_to, msg.sender);   
        }

        function closeTipVault(address _splitAddr) external payable     {
              tipVaultByAddr[_splitAddr].close(msg.sender);  
        }               


        function getTipVaultsAddr(address _owner) external view returns (address[] memory){
           if(_owner==address(0)){
                address[] memory  ret = new address[](allTipVaults.length);

                for(uint i =0 ;i<allTipVaults.length;i++)
                {                   
                    ret[i]=address(allTipVaults[i]);
                }

                return ret;
           }
           
           return tipVaultsByOwner[_owner];     
        }

        function getTipVaults(address _tipOwner) external view returns (VaultStruct.tipVaultStruct[] memory){
                VaultStruct.tipVaultStruct[] memory  ret = new VaultStruct.tipVaultStruct[](tipVaultsByOwner[_tipOwner].length);

                for(uint i =0 ;i<tipVaultsByOwner[_tipOwner].length;i++)
                {                                
                    ret[i] = tipVaultByAddr[tipVaultsByOwner[_tipOwner][i]].getTipVaultStruct();
                }
                
            return ret;
        }

        function getTipsByOwnerAddr(address _tipsOwner) external view returns (VaultStruct.Tip[] memory){

                VaultStruct.Tip[] memory ret = new VaultStruct.Tip[](tipsByUser[_tipsOwner].length);
                    for(uint i= 0 ;i<tipsByUser[_tipsOwner].length;i++)
                    {
                        ret[i] =  tipVaultByAddr[tipsByUser[_tipsOwner][i]].getTipStructOfUser(_tipsOwner);

                    }  
                    return ret;
        }

        function getAllTipVaults() external view returns (VaultStruct.tipVaultStruct[] memory){
           VaultStruct.tipVaultStruct[] memory  ret = new VaultStruct.tipVaultStruct[](allTipVaults.length);

           for(uint i =0 ;i<allTipVaults.length;i++)
           {               
               ret[i] = allTipVaults[i].getTipVaultStruct();
           }
           
            return ret;
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

        function getBalance() external view returns(uint){
            return address(this).balance;

        }
    
        function addToken(
            bytes32 ticker,
            address tokenAddress)
            onlyAdmin()
            external {
            tokens[ticker] = VaultStruct.Token(ticker, tokenAddress);
            tokenList.push(ticker);
        }

        function string_tobytes( string memory s) internal pure  returns (bytes memory ){
            bytes memory b3 = bytes(s);
            return b3;
        }

        
        modifier onlyAdmin() {
            require(msg.sender == admin, 'only admin');
            _;
        }
}
