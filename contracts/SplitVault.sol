pragma solidity 0.8.0;

import '@openzeppelin/contracts/token/ERC20/IERC20.sol';

contract SplitVault{

        // SplitsVaults & Vaults par ID
        mapping(uint => SplitVault) splitVaults;    
        mapping(uint => Vault) Vaults;
        // liens splitVaults / Vaults
        mapping(uint=> uint[]) VaultsId_By_splitVaultId;
        
        //Splits & Vaults par owner
        mapping(address=> uint[]) splitVaultsIdsByOwner;
        mapping(address=> uint[]) VaultsIdsByOwner;
        mapping(uint=> address) splitVaultOwnerById;
        mapping(uint=> address) VaultOwnerById;

        address[] splitOwnersList;
        mapping(address=> bool) isOwnerAlreadyThere;
        uint splitVaultsCount;
        
        // Tokens
        mapping(bytes32 => Token) public tokens;
        bytes32[] public tokenList;

        uint splitVaultNextId;
        uint VaultNextId;
        
        uint oneWei= 1 wei;

        address admin;
        address bnbAddress= 0xB8c77482e45F1F44dE1745F52C74426C631bDD52;

        struct Token {
            bytes32 ticker;
            address tokenAddress;
         }

        struct SplitVault{  
            uint splitId;          
            string name;    
            bool open;
            uint totalAmount;                 
        }

        // part en 1/1000 (10% => 100)
        struct Vault{
            uint VaultId;
            address from;
            uint amount;
            uint part;
            uint splitId;
        }        

        constructor( ){
            admin= msg.sender;
            splitVaultNextId=0;
            VaultNextId=0;
        }

        function createSplitVault(string memory name) external returns(uint){            
            splitVaults[splitVaultNextId] = SplitVault(splitVaultNextId,name,true, 0);
                   
             if(isOwnerAlreadyThere[msg.sender]==false){
                 splitOwnersList.push(msg.sender); 
                 isOwnerAlreadyThere[msg.sender]=true;
             }  
             
         
            uint[] storage sbByAdress = splitVaultsIdsByOwner[msg.sender];
            sbByAdress.push(splitVaultNextId);
            splitVaultOwnerById[splitVaultNextId]= msg.sender;

            splitVaultNextId++;
            splitVaultsCount++;           
            return splitVaultNextId-1;
        }

        function deposit(uint splitVaultId, uint amount) external returns (uint ) {
            bool isOpen = splitVaults[splitVaultId].open;
            require(isOpen==true,'l inscription a ce splitVault est cloture');

            IERC20(tokens[tokenList[0]].tokenAddress).transferFrom(
                    msg.sender,
                    address(this),
                    amount
                    );

            Vaults[VaultNextId] = Vault(VaultNextId,msg.sender, amount, 0, splitVaultId); 

            splitVaults[splitVaultId].totalAmount += amount;  
            uint[] storage VaultsSplit = VaultsId_By_splitVaultId[splitVaultId];   
            VaultsSplit.push(VaultNextId);

            VaultOwnerById[VaultNextId]= msg.sender;

            uint[] storage VaultsByAdress = VaultsIdsByOwner[msg.sender]; 
            VaultsByAdress.push(VaultNextId);
            
            VaultNextId++;
            return (VaultNextId - 1);
        }        

        function retire (uint id,  uint amount) external isSplitFromSender(id){           
           
            uint[] storage _VaultIds = VaultsId_By_splitVaultId[id];
            uint amountToTransfer;

            for(uint i =0;i< _VaultIds.length;i++){  
                //uint amountToTransfer = amount * (Vaults[_VaultIds[i]].part/1000);
                uint VaultPart = Vaults[_VaultIds[i]].part;
                amountToTransfer = (amount/1e18) * VaultPart * 1e15;
                
                IERC20(tokens[tokenList[0]].tokenAddress).transfer(
                    Vaults[_VaultIds[i]].from,
                    amountToTransfer
                 );
            }
        }

        function closeSubsplitVault(uint id) external isSplitFromSender(id) {           

            SplitVault storage sb =  splitVaults[id];      

            // calcul repartition
            uint[] memory _VaultsId = VaultsId_By_splitVaultId[id];
            

            for(uint j =0;j< _VaultsId.length;j++){  
                Vault storage _Vault=  Vaults[_VaultsId[j]];
               
                _Vault.part = (_Vault.amount *1000) / sb.totalAmount;
                //_Vault.part = _Vault.amount / TotalAmount * 1000;
            }
            sb.open = false;
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

        function getSplitVaults(address sbOwner) external view returns(SplitVault[] memory){       
            uint[] memory splitVaultsOfOwner= splitVaultsIdsByOwner[sbOwner];
            SplitVault[] memory ret = new SplitVault[](splitVaultsOfOwner.length);
            for(uint i =0;i< splitVaultsOfOwner.length;i++){
                ret[i]=splitVaults[splitVaultsOfOwner[i]];     
           } 

            return ret;
        }

        function getSplitVaultById(uint id) external view returns(SplitVault memory){  
            return splitVaults[id];
        }

        function getAllSplitVaults() external view returns(SplitVault[] memory){      
            SplitVault[] memory ret =new SplitVault[](splitVaultsCount);
            uint index=0;

             for(uint i =0;i< splitOwnersList.length;i++){  
                
                  for(uint j =0;j< splitVaultsIdsByOwner[splitOwnersList[i]].length;j++){ 
                      
                      uint id =splitVaultsIdsByOwner[splitOwnersList[i]][j];  
                      ret[index]= splitVaults[id];
                      index += 1;   
                  }     
             }   
            return ret;
        }

        function getVaultById(uint id) public view returns (Vault memory){
            return Vaults[id];
        }

       

        function getVaultsByAddress(address addr) external view returns (Vault[] memory){
           uint[] memory VaultsId = VaultsIdsByOwner[addr];
            Vault[] memory ret= new Vault[](VaultsId.length);   
                for(uint i =0;i< VaultsId.length;i++){  
                  ret[i]= Vaults[VaultsId[i]]; 
                }   
            return ret;
        }

        
        function getTotalAmountsplitVault(uint id) public view returns(uint){
            uint[] memory _VaultIds = VaultsId_By_splitVaultId[id];
            uint ret = 0;
            for(uint i =0;i< _VaultIds.length;i++){  
                ret += Vaults[_VaultIds[i]].amount;
            }
            return ret;
        }

        modifier isSplitFromSender(uint id) {
            bool ok= false;
            uint[] memory splitIdsFromSender = splitVaultsIdsByOwner[msg.sender];
            for(uint i =0;i< splitIdsFromSender.length;i++){  
                if (splitIdsFromSender[i] == id){
                    ok=true;
                }            
            }
            require(
                ok==true,
                'Ce splitVault ne vous appartient pas'
            );
        _;
        }


        modifier tokenExist(bytes32 ticker) {
            require(
                tokens[ticker].tokenAddress != address(0),
                'this token does not exist'
            );
        _;
        }
        
        modifier onlyAdmin() {
            require(msg.sender == admin, 'only admin');
            _;
        }
}