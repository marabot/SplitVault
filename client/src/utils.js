import Web3 from 'web3';
import SplitVaults from './contracts/SplitVault.json';
import ERC20Abi from './contracts/fixMapBug/ERC20Abi.json';

const getWeb3 = () => {
    return new Promise((resolve, reject) => {
      // Wait for loading completion to avoid race conditions with web3 injection timing.
      window.addEventListener("load", async () => {
        // Modern dapp browsers...
        if (window.ethereum) {
          const web3 = new Web3(window.ethereum);
          try {
            // Request account access if needed
            await window.ethereum.enable();
            // Acccounts now exposed
            resolve(web3);
          } catch (error) {
            reject(error);
          }
        }
        // Legacy dapp browsers...
        else if (window.web3) {
          // Use Mist/MetaMask's provider.
          const web3 = window.web3;
          console.log("Injected web3 detected.");
          resolve(web3);
        }
        // Fallback to localhost; use dev console port by default...
        else {
          const provider = new Web3.providers.HttpProvider(
            "http://localhost:9545"
          );
          const web3 = new Web3(provider);
          console.log("No web3 instance injected, using Local web3.");
          resolve(web3);
        }
      });
    });
  };


  const getContracts = async web3 => {
    const networkId = await web3.eth.net.getId();
    const deployedNetwork = SplitVaults.networks[networkId];
    const splitVault = new web3.eth.Contract(
      SplitVaults.abi,
      deployedNetwork && deployedNetwork.address,
    );

    const tokens = await splitVault.methods.getTokens().call();
    const tokenContracts = tokens.reduce((acc, token) => ({
      ...acc,
      [web3.utils.hexToUtf8(token.ticker)]: new web3.eth.Contract(
        ERC20Abi,
        token.tokenAddress
      )
    }), {});
    return { splitVault , ...tokenContracts };
  }

  export { getWeb3, getContracts };