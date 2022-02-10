pragma solidity 0.8.0;


library VaultStruct{
     struct Token {
            bytes32 ticker;
            address tokenAddress;
        }

        struct tipVaultStruct {
            address addr;
            string name;
            address from;
            uint totalAmount;
            bool isOpen;
        }

      struct Bag{    
            address from;                
            uint amount;
            uint part;                    
        }     

          struct Tip{    
            address from; 
            address vaultFor;               
            uint amount;                              
        }           


}