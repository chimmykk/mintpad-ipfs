import { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { ethers } from 'ethers';

export default function SetMintPhase() {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const collectionAddress = '0x7826918E5eC4Ae9dBc6fD3a0bd28c2fc9bE7e5e9'; // Hardcoded collection address

  const handleSetMintPhase = async () => {
    if (typeof window.ethereum === 'undefined') {
      setMessage('MetaMask is not installed.');
      return;
    }

    setLoading(true);
    setMessage('');

    // Convert selected dates to Unix timestamps
    const startTimestamp = Math.floor(new Date(startDate).getTime() / 1000);
    const endTimestamp = Math.floor(new Date(endDate).getTime() / 1000);

    try {
      // Request user to connect their wallet
      await window.ethereum.request({ method: 'eth_requestAccounts' });

      // Initialize provider and signer
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      // Get the contract instance
      const collectionContract = new ethers.Contract(
        collectionAddress,
        ['function setMintPhase(uint256 startTime, uint256 endTime) external'],
        signer
      );

      // Send the transaction to set mint phase
      const tx = await collectionContract.setMintPhase(startTimestamp, endTimestamp);
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

      <div style={{ marginBottom: '20px' }}>
        <label>Select Mint Start Date: </label>
        <DatePicker
          selected={startDate}
          onChange={(date) => setStartDate(date)}
          showTimeSelect
          dateFormat="Pp"
        />
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label>Select Mint End Date: </label>
        <DatePicker
          selected={endDate}
          onChange={(date) => setEndDate(date)}
          showTimeSelect
          dateFormat="Pp"
        />
      </div>

      <button onClick={handleSetMintPhase} disabled={loading}>
        {loading ? 'Setting Mint Phase...' : 'Set Mint Phase'}
      </button>

      {message && <p style={{ marginTop: '20px' }}>{message}</p>}
    </div>
  );
}
