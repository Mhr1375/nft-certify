import React, { createContext, useState, useEffect, useCallback } from "react";
import { ethers } from "ethers";
import Web3Modal from "web3modal";

// ABI imports
import CertificateNFTArtifact from "../artifacts/contracts/CertificateNFT.sol/CertificateNFT.json";

export const Web3Context = createContext();

const providerOptions = {};

export const Web3Provider = ({ children }) => {
  const [web3Modal, setWeb3Modal] = useState(null);
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [account, setAccount] = useState(null);
  const [network, setNetwork] = useState(null);
  const [chainId, setChainId] = useState(null);
  const [contract, setContract] = useState(null);
  const [contractAddress, setContractAddress] = useState(null);
  const [isDeploying, setIsDeploying] = useState(false);
  const [isDeployed, setIsDeployed] = useState(false);

  // Initialize web3Modal
  useEffect(() => {
    const modal = new Web3Modal({
      cacheProvider: true,
      providerOptions,
    });
    setWeb3Modal(modal);
  }, []);

  // Connect wallet
  const connectWallet = useCallback(async () => {
    try {
      const instance = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(instance);
      const signer = provider.getSigner();
      const network = await provider.getNetwork();
      const address = await signer.getAddress();

      setProvider(provider);
      setSigner(signer);
      setAccount(address);
      setNetwork(network.name);
      setChainId(network.chainId);

      // Check if contract is already deployed
      try {
        // Try to get contract from local storage
        const storedContractAddress = localStorage.getItem("contractAddress");
        if (storedContractAddress) {
          setContractAddress(storedContractAddress);
          const contract = new ethers.Contract(
            storedContractAddress,
            CertificateNFTArtifact.abi,
            signer
          );
          setContract(contract);
          setIsDeployed(true);
        }
      } catch (error) {
        console.log("Contract not deployed yet:", error);
      }

      // Subscribe to account change
      instance.on("accountsChanged", (accounts) => {
        setAccount(accounts[0]);
      });

      // Subscribe to chainId change
      instance.on("chainChanged", (chainId) => {
        window.location.reload();
      });

      return { provider, signer, address, network };
    } catch (error) {
      console.error("Error connecting wallet:", error);
      return null;
    }
  }, [web3Modal]);

  // Deploy contract
  const deployContract = useCallback(async () => {
    if (!signer) {
      console.error("No signer available");
      return null;
    }

    try {
      setIsDeploying(true);
      // Create contract factory
      const contractFactory = new ethers.ContractFactory(
        CertificateNFTArtifact.abi,
        CertificateNFTArtifact.bytecode,
        signer
      );

      // Deploy contract
      const deployedContract = await contractFactory.deploy();
      await deployedContract.deployed();

      setContractAddress(deployedContract.address);
      setContract(deployedContract);
      setIsDeployed(true);
      setIsDeploying(false);

      // Save contract address to local storage
      localStorage.setItem("contractAddress", deployedContract.address);

      return deployedContract;
    } catch (error) {
      console.error("Error deploying contract:", error);
      setIsDeploying(false);
      return null;
    }
  }, [signer]);

  // Disconnect wallet
  const disconnectWallet = useCallback(async () => {
    if (web3Modal) {
      web3Modal.clearCachedProvider();
      setProvider(null);
      setSigner(null);
      setAccount(null);
      setNetwork(null);
      setChainId(null);
      setContract(null);
      setContractAddress(null);
      setIsDeployed(false);
    }
  }, [web3Modal]);

  // Auto connect if cached
  useEffect(() => {
    if (web3Modal && web3Modal.cachedProvider) {
      connectWallet();
    }
  }, [web3Modal, connectWallet]);

  return (
    <Web3Context.Provider
      value={{
        connectWallet,
        disconnectWallet,
        deployContract,
        provider,
        signer,
        account,
        network,
        chainId,
        contract,
        contractAddress,
        isDeployed,
        isDeploying,
      }}
    >
      {children}
    </Web3Context.Provider>
  );
}; 