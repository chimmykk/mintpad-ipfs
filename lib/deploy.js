import { ethers } from 'ethers';

// Replace with your actual contract address and ABI
const factoryAddress = "0x39bADC7850ac3D5b7E319C275600D04FA2834479";
const factoryABI = [
  {
    "inputs": [
      { "internalType": "string", "name": "name", "type": "string" },
      { "internalType": "string", "name": "symbol", "type": "string" },
      { "internalType": "uint256", "name": "mintPrice", "type": "uint256" },
      { "internalType": "uint256", "name": "maxSupply", "type": "uint256" },
      { "internalType": "string", "name": "baseURI", "type": "string" },
      { "internalType": "address payable", "name": "recipient", "type": "address" },
      { "internalType": "address payable", "name": "royaltyRecipient", "type": "address" },
      { "internalType": "uint256", "name": "royaltyPercentage", "type": "uint256" }
    ],
    "name": "deployCollection",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "PLATFORM_FEE",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "address", "name": "collectionAddress", "type": "address" },
      { "indexed": true, "internalType": "address", "name": "owner", "type": "address" },
      { "indexed": false, "internalType": "uint256", "name": "mintPrice", "type": "uint256" },
      { "indexed": false, "internalType": "uint256", "name": "maxSupply", "type": "uint256" },
      { "indexed": false, "internalType": "string", "name": "baseURI", "type": "string" }
    ],
    "name": "CollectionDeployed",
    "type": "event"
  }
];

export async function deployCollection({
  name,
  symbol,
  mintPrice,
  maxSupply,
  baseURI,
  recipient,
  royaltyRecipient,
  royaltyPercentage,
  provider,
}) {
  if (!provider) throw new Error("Provider is required");

  const signer = provider.getSigner();
  const factory = new ethers.Contract(factoryAddress, factoryABI, signer);

  // Retrieve the platform fee from the factory contract
  const platformFee = await factory.PLATFORM_FEE();

  // Deploy a new collection with the specified parameters
  const tx = await factory.deployCollection(
    name,
    symbol,
    mintPrice,
    maxSupply,
    baseURI,
    recipient,
    royaltyRecipient,
    royaltyPercentage,
    { value: platformFee }
  );

  console.log("Transaction sent:", tx.hash);

  // Wait for the transaction to be mined
  const receipt = await tx.wait();

  // Extract and log the deployed collection's address from the event logs
  const event = receipt.events.find(event => event.event === 'CollectionDeployed');
  const collectionAddress = event.args.collectionAddress;
  console.log("Collection deployed at:", collectionAddress);

  return collectionAddress;
}
