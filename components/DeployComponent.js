"use client";
import { useState } from 'react';
import { ethers } from 'ethers';
import { deployCollection } from '../lib/deploy';
import UploadComponent, {Uploadcomponent} from "../components/Uploadcomponent"

export default function DeployComponent() {
  const [account, setAccount] = useState(null);
  const [chainId, setChainId] = useState(null);
  const [status, setStatus] = useState('');

  // State for form inputs
  const [name, setName] = useState('');
  const [symbol, setSymbol] = useState('');
  const [mintPrice, setMintPrice] = useState('');
  const [maxSupply, setMaxSupply] = useState('');
  const [baseURI, setBaseURI] = useState('');
  const [recipient, setRecipient] = useState('');
  const [royaltyRecipient, setRoyaltyRecipient] = useState('');
  const [royaltyPercentage, setRoyaltyPercentage] = useState('');

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

  const handleDeploy = async () => {
    if (!account) {
      alert('Please connect your wallet first.');
      return;
    }

    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      const contract = await deployCollection({
        name,
        symbol,
        mintPrice: ethers.utils.parseEther(mintPrice), // Convert mintPrice to ethers
        maxSupply: parseInt(maxSupply, 10), // Convert maxSupply to integer
        baseURI,
        recipient,
        royaltyRecipient,
        royaltyPercentage: parseInt(royaltyPercentage, 10), // Convert royaltyPercentage to integer
        provider,
        signer, // Pass the signer to the deploy function
      });

      setStatus(`Collection of contract address ${contract}. has been succesfully deployed`);

    } catch (error) {
      console.error('Error deploying collection:', error);
      setStatus('Failed to deploy collection.');
    }
  };

  return (
    <div style={{ maxWidth: '500px', margin: '0 auto', padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      {account ? (

        <div>
          <UploadComponent></UploadComponent>
          <p><strong>Connected account:</strong> {account}</p>
          <p><strong>Connected chain ID:</strong> {chainId}</p>
          <div style={{ display: 'grid', gridGap: '10px', marginBottom: '20px' }}>
            <label>
              Name:
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} style={{ width: '100%', padding: '8px', color: 'black' }} />
            </label>
            <label>
              Symbol:
              <input type="text" value={symbol} onChange={(e) => setSymbol(e.target.value)} style={{ width: '100%', padding: '8px', color: 'black' }} />
            </label>
            <label>
              Mint Price (ETH):
              <input type="text" value={mintPrice} onChange={(e) => setMintPrice(e.target.value)} style={{ width: '100%', padding: '8px', color: 'black' }} />
            </label>
            <label>
              Max Supply:
              <input type="number" value={maxSupply} onChange={(e) => setMaxSupply(e.target.value)} style={{ width: '100%', padding: '8px', color: 'black' }} />
            </label>
            <label>
              Base URI:
              <input type="text" value={baseURI} onChange={(e) => setBaseURI(e.target.value)} style={{ width: '100%', padding: '8px', color: 'black' }} />
            </label>
            <label>
              Recipient Address:
              <input type="text" value={recipient} onChange={(e) => setRecipient(e.target.value)} style={{ width: '100%', padding: '8px', color: 'black' }} />
            </label>
            <label>
              Royalty Recipient Address:
              <input type="text" value={royaltyRecipient} onChange={(e) => setRoyaltyRecipient(e.target.value)} style={{ width: '100%', padding: '8px', color: 'black' }} />
            </label>
            <label>
              Royalty Percentage (in basis points):
              <input type="number" value={royaltyPercentage} onChange={(e) => setRoyaltyPercentage(e.target.value)} style={{ width: '100%', padding: '8px', color: 'black' }} />
            </label>
          </div>
          <button onClick={handleDeploy} style={{ width: '100%', padding: '10px', backgroundColor: '#0070f3', color: 'white', border: 'none', borderRadius: '5px' }}>
            Deploy Collection
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
