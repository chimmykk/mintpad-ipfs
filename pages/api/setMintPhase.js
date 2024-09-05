// pages/api/setMintPhase.js
import { ethers } from 'ethers';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { startTime, endTime } = req.body;
  const collectionAddress = '0x7826918E5eC4Ae9dBc6fD3a0bd28c2fc9bE7e5e9'; // Hardcoded collection address

  try {
    // Connect to the Ethereum provider
    const provider = new ethers.providers.JsonRpcProvider(process.env.ALCHEMY_API_URL); // Use your RPC URL
    const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider); // Use your private key

    // Get the contract instance
    const collectionContract = new ethers.Contract(
      collectionAddress,
      ['function setMintPhase(uint256 startTime, uint256 endTime) external'],
      signer
    );

    // Send the transaction to set mint phase
    const tx = await collectionContract.setMintPhase(startTime, endTime);
    await tx.wait();

    return res.status(200).json({ message: 'Mint phase set successfully', txHash: tx.hash });
  } catch (error) {
    console.error('Error setting mint phase:', error);
    return res.status(500).json({ error: 'Failed to set mint phase' });
  }
}
