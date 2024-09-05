"use client";
import { useState } from 'react';
import { ethers } from 'ethers';

export default function MintComponent() {
  const [account, setAccount] = useState(null);
  const [chainId, setChainId] = useState(null);
  const [status, setStatus] = useState('');
  const [tokenId, setTokenId] = useState('');
  const [mintPrice, setMintPrice] = useState(''); // Assuming mintPrice is fetched from the contract
  
  // Address of the deployed contract
  const collectionAddress = "0x3d952a2F6e5cC470a5a4d4e91f9aeb29b77c8413";

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send('eth_requestAccounts', []);
        const signer = provider.getSigner();
        const userAddress = await signer.getAddress();
        const network = await provider.getNetwork();

        setAccount(userAddress);
        setChainId(network.chainId);
      } catch (error) {
        console.error('Error connecting wallet:', error);
      }
    } else {
      alert('Please install MetaMask!');
    }
  };

  const handleMint = async () => {
    if (!account) {
      alert('Please connect your wallet first.');
      return;
    }

    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const collectionContract = new ethers.Contract(collectionAddress, [
        // ABI definition goes here
        "function mint(uint256 tokenId) external payable",
        "function mintPrice() external view returns (uint256)"
      ], signer);

      // Fetch current mint price
      const currentMintPrice = await collectionContract.mintPrice();
      setMintPrice(ethers.utils.formatEther(currentMintPrice)); // Display mint price in ETH

      console.log(`Minting token with ID ${tokenId}...`);
      const txMint = await collectionContract.mint(tokenId, {
        value: currentMintPrice, // Send the correct amount of ETH for minting
      });
      console.log("Minting transaction sent:", txMint.hash);

      // Wait for the transaction to be confirmed
      const receipt = await txMint.wait();
      console.log(`Token ID ${tokenId} minted successfully!`);

      // Retrieve the token URI
      const tokenURI = await collectionContract.tokenURI(tokenId);
      console.log(`Token URI for token ID ${tokenId}: ${tokenURI}`);
      setStatus(`Token ID ${tokenId} minted successfully! Token URI: ${tokenURI}`);

    } catch (error) {
      console.error('Error minting token:', error);
      setStatus('Failed to mint token.');
    }
  };

  return (
    <div style={{ maxWidth: '500px', margin: '0 auto', padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      {account ? (
        <div>
          <p><strong>Connected account:</strong> {account}</p>
          <p><strong>Connected chain ID:</strong> {chainId}</p>
          <div style={{ display: 'grid', gridGap: '10px', marginBottom: '20px' }}>
            <label>
              Token ID:
              <input type="number" value={tokenId} onChange={(e) => setTokenId(e.target.value)} style={{ width: '100%', padding: '8px', color: 'black' }} />
            </label>
            <p>Mint Price (ETH): {mintPrice}</p>
          </div>
          <button onClick={handleMint} style={{ width: '100%', padding: '10px', backgroundColor: '#0070f3', color: 'white', border: 'none', borderRadius: '5px' }}>
            Mint Token
          </button>
          {status && <p style={{ marginTop: '20px' }}>{status}</p>}
        </div>
      ) : (
        <button onClick={connectWallet} style={{ width: '100%', padding: '10px', backgroundColor: '#0070f3', color: 'white', border: 'none', borderRadius: '5px' }}>
          Connect MetaMask
        </button>
      )}
    </div>
  );
}
