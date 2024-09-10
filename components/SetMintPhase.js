"use client"
import { useState } from 'react';
import { ethers } from 'ethers';

export default function SetMintPhase() {
  const [startDate, setStartDate] = useState(new Date().toISOString().slice(0, 16));
  const [endDate, setEndDate] = useState(new Date().toISOString().slice(0, 16));
  const [mintPhase, setMintPhase] = useState(1); // Default to public mint
  const [phaseSupply, setPhaseSupply] = useState(100); // Example default supply
  const [phaseMintPrice, setPhaseMintPrice] = useState('0.01'); // Default mint price in Ether
  const [phaseMintLimit, setPhaseMintLimit] = useState(5); // Default mint limit per wallet
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [account, setAccount] = useState(null);

  const collectionAddress = '0xb012032613E957c13acC3b806bE4E60f6Fc0e701'; // Your contract address
  const contractABI = [
    'function setMintPhase(uint256 startTime, uint256 endTime, uint256 mintPhase, uint256 phaseSupply, uint256 phaseMintPrice, uint256 phaseMintLimit) external',
  ];

  // Function to connect MetaMask wallet
  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send('eth_requestAccounts', []); // Request MetaMask accounts
        const signer = provider.getSigner();
        const userAddress = await signer.getAddress();
        setAccount(userAddress); // Store the user address in state
      } catch (error) {
        console.error('Error connecting wallet:', error);
      }
    } else {
      alert('Please install MetaMask!');
    }
  };

  // Function to set the mint phase
  const handleSetMintPhase = async () => {
    if (!account) {
      alert('Please connect your wallet first.');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      // Create contract instance
      const collectionContract = new ethers.Contract(collectionAddress, contractABI, signer);

      // Convert mint price to Wei (smallest Ether unit)
      const mintPriceInWei = ethers.utils.parseEther(phaseMintPrice);

      // Send the transaction to set the mint phase
      const tx = await collectionContract.setMintPhase(
        Math.floor(new Date(startDate).getTime() / 1000), // Convert to seconds
        Math.floor(new Date(endDate).getTime() / 1000),   // Convert to seconds
        mintPhase,
        phaseSupply,
        mintPriceInWei,
        phaseMintLimit
      );

      // Wait for the transaction to be confirmed
      await tx.wait();

      setMessage(`Mint phase set successfully! Transaction Hash: ${tx.hash}`);
    } catch (error) {
      console.error('Error setting mint phase:', error);
      setMessage('An error occurred while setting the mint phase.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Set Mint Phase</h1>

      {!account ? (
        <button
          onClick={connectWallet}
          style={{
            padding: '10px 20px',
            borderRadius: '5px',
            border: 'none',
            backgroundColor: '#0070f3',
            color: '#fff',
            fontSize: '16px',
            cursor: 'pointer',
          }}
        >
          Connect Wallet
        </button>
      ) : (
        <div>
          <div style={{ marginBottom: '20px' }}>
            <label htmlFor="start-date" style={{ display: 'block', marginBottom: '5px' }}>
              Select Mint Start Date:
            </label>
            <input
              id="start-date"
              type="datetime-local"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              style={{
                padding: '10px',
                borderRadius: '5px',
                border: '1px solid #ccc',
                fontSize: '16px',
              }}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label htmlFor="end-date" style={{ display: 'block', marginBottom: '5px' }}>
              Select Mint End Date:
            </label>
            <input
              id="end-date"
              type="datetime-local"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              style={{
                padding: '10px',
                borderRadius: '5px',
                border: '1px solid #ccc',
                fontSize: '16px',
              }}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label htmlFor="mint-phase">Mint Phase:</label>
            <input
              id="mint-phase"
              type="number"
              value={mintPhase}
              onChange={(e) => setMintPhase(Number(e.target.value))}
              style={{
                padding: '10px',
                borderRadius: '5px',
                border: '1px solid #ccc',
                fontSize: '16px',
              }}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label htmlFor="phase-supply">Phase Supply:</label>
            <input
              id="phase-supply"
              type="number"
              value={phaseSupply}
              onChange={(e) => setPhaseSupply(Number(e.target.value))}
              style={{
                padding: '10px',
                borderRadius: '5px',
                border: '1px solid #ccc',
                fontSize: '16px',
              }}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label htmlFor="phase-mint-price">Phase Mint Price (ETH):</label>
            <input
              id="phase-mint-price"
              type="text"
              value={phaseMintPrice}
              onChange={(e) => setPhaseMintPrice(e.target.value)}
              style={{
                padding: '10px',
                borderRadius: '5px',
                border: '1px solid #ccc',
                fontSize: '16px',
              }}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label htmlFor="phase-mint-limit">Mint Limit Per Wallet:</label>
            <input
              id="phase-mint-limit"
              type="number"
              value={phaseMintLimit}
              onChange={(e) => setPhaseMintLimit(Number(e.target.value))}
              style={{
                padding: '10px',
                borderRadius: '5px',
                border: '1px solid #ccc',
                fontSize: '16px',
              }}
            />
          </div>

          <button
            onClick={handleSetMintPhase}
            disabled={loading}
            style={{
              padding: '10px 20px',
              borderRadius: '5px',
              border: 'none',
              backgroundColor: '#0070f3',
              color: '#fff',
              fontSize: '16px',
              cursor: 'pointer',
            }}
          >
            {loading ? 'Setting Mint Phase...' : 'Set Mint Phase'}
          </button>

          {message && <p style={{ marginTop: '20px', color: 'red' }}>{message}</p>}
        </div>
      )}
    </div>
  );
}
