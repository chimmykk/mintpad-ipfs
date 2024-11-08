"use client";
import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import contractAbi from "./contractAbi.json";

const UpdateIpfsToContract = ({
  ipfsLink: initialIpfsLink,
  fileSize: initialFileSize,
}) => {
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [contractAddress, setContractAddress] = useState("");
  const [ipfsLink, setIpfsLink] = useState(initialIpfsLink || "");
  const [amount, setAmount] = useState();
  const [data, setData] = useState("0x"); // Default to empty bytes

  useEffect(() => {
    if (initialIpfsLink) {
      setIpfsLink(initialIpfsLink);
    }
  }, [initialIpfsLink]);

  const updateContract = async () => {
    if (!ipfsLink || !amount || !contractAddress || !data) {
      setStatus("IPFS link, amount, contract address, or data is missing.");
      return;
    }

    setLoading(true);
    try {
      const baseURIForTokens = String(ipfsLink); // Ensure it's a string
      const dataBytes = ethers.utils.arrayify(data); // Convert hex data to bytes

      // Initialize Ethereum provider and signer
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      // Contract instance
      const contract = new ethers.Contract(
        contractAddress,
        contractAbi,
        signer,
      );

      // Call the contract method with the correct data types
      const tx = await contract.lazyMint(
        ethers.BigNumber.from(amount),
        baseURIForTokens,
        dataBytes,
      );

      // Wait for the transaction to be mined
      await tx.wait();

      setStatus("Successfully updated the contract with IPFS and amount.");
    } catch (error) {
      console.error("Error interacting with the contract:", error);
      setStatus("An error occurred while updating the contract.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "20px" }}>
      <div style={{ marginBottom: "15px" }}>
        <input
          type="text"
          value={contractAddress}
          onChange={(e) => setContractAddress(e.target.value)}
          placeholder="Enter Contract Address"
          style={inputStyles}
        />
      </div>

      <div style={{ marginBottom: "15px" }}>
        <input
          type="text"
          value={ipfsLink}
          onChange={(e) => setIpfsLink(e.target.value)}
          placeholder="Enter IPFS Link"
          style={inputStyles}
        />
      </div>

      <div style={{ marginBottom: "15px" }}>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          placeholder="Enter Amount Collection Size(uint256)"
          style={inputStyles}
        />
      </div>

      <div style={{ marginBottom: "15px" }}>
        <input
          type="text"
          value={data}
          onChange={(e) => setData(e.target.value)}
          placeholder="Enter Data (hex format, e.g., 0x...)"
          style={inputStyles}
        />
      </div>

      <button
        onClick={updateContract}
        disabled={loading}
        style={buttonStyles(loading)}
      >
        {loading ? "Updating..." : "Update Contract with IPFS"}
      </button>

      {/* Status message */}
      {status && (
        <div style={statusMessageStyles(loading)}>
          <p>{status}</p>
        </div>
      )}
    </div>
  );
};

// Custom styles
const inputStyles = {
  padding: "12px",
  fontSize: "16px",
  width: "100%",
  maxWidth: "350px",
  marginRight: "10px",
  borderRadius: "5px",
  border: "1px solid #ddd",
  backgroundColor: "#fff",
  color: "#333",
  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
};

const buttonStyles = (loading) => ({
  padding: "12px 24px",
  backgroundColor: "#007BFF",
  color: "white",
  border: "none",
  borderRadius: "5px",
  cursor: loading ? "not-allowed" : "pointer",
  fontSize: "16px",
});

const statusMessageStyles = (loading) => ({
  marginTop: "20px",
  backgroundColor: loading ? "#e7f5ff" : "#ffcccc",
  padding: "15px",
  borderRadius: "8px",
  color: loading ? "#333" : "#ff0000",
});

export default UpdateIpfsToContract;
