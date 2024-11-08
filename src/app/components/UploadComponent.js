"use client";
import { useState, useEffect } from "react";
import UpdateIpfsToContract from "./UpdateIpfsToContract"; // Import the new component

export default function UploadComponent() {
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [logs, setLogs] = useState("");
  const [progress, setProgress] = useState(0); // State for progress
  const [totalFiles, setTotalFiles] = useState(0); // State for total files count
  const [uploadComplete, setUploadComplete] = useState(false); // New state to track upload completion
  const [ipfsLink, setIpfsLink] = useState(""); // To store IPFS link
  const [fileSize, setFileSize] = useState(0); // To store file size for contract update
  const [secondRootCid, setSecondRootCid] = useState(""); // State for storing the second Root CID

  console.log("second", secondRootCid)

  useEffect(() => {
    if (secondRootCid) {
      const fullIpfsLink = `https://uneven-lavender-harrier.myfilebase.com/ipfs/${secondRootCid}/`;
      setIpfsLink(fullIpfsLink);
    }
  }, [secondRootCid]);

  const handleFolderUpload = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    const files = event.target.files.files;

    if (files.length === 0) {
      setMessage("Please select a folder to upload.");
      return;
    }

    Array.from(files).forEach((file) => {
      formData.append("files", file, file.webkitRelativePath);
    });

    setUploading(true);
    setMessage("");
    setLogs("");
    setProgress(0); // Reset progress to 0

    // Create a new XMLHttpRequest
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/api/uploadFolder", true);

    // Event listener to track progress
    xhr.upload.addEventListener("progress", (event) => {
      if (event.lengthComputable) {
        const percent = (event.loaded / event.total) * 100;
        setProgress(percent); // Update the progress state
      }
    });

    xhr.onload = async () => {
      const result = JSON.parse(xhr.responseText);

      if (xhr.status === 200) {
        setMessage("Upload successful.");
        setLogs(result.logs);
        setUploadComplete(true); // Mark upload as complete

          // Set the second Root CID from the logs
          if (result.logs && result.logs.includes("Root CID:")) {
            const logParts = result.logs.split("\n");
            const rootCidLines = logParts.filter((line) =>
              line.includes("Root CID:"),
            ); // Filter lines that contain "Root CID"
  
            if (rootCidLines.length > 1) {
              const secondRootCidLine = rootCidLines[1]; // Get the second Root CID line
              setSecondRootCid(
                secondRootCidLine.replace("Root CID: ", "").trim(),
              ); // Extract and set the second Root CID
            }
          }

          // const fullIpfsLink = `https://uneven-lavender-harrier.myfilebase.com/ipfs/${secondRootCid}/`;

        // setIpfsLink(fullIpfsLink); // Store IPFS link from response
        setFileSize(result.fileSize); // Store file size for contract update

        console.log("haha", ipfsLink)

      
      } else {
        setMessage("Upload failed.");
        setLogs(result.logs);
      }
      setUploading(false);
    };

    xhr.onerror = () => {
      setMessage("An error occurred during the upload.");
      setUploading(false);
    };

    xhr.send(formData);
  };

  // Handle file selection
  const handleFileSelection = (event) => {
    const files = event.target.files; // Directly access 'files'
    setTotalFiles(files.length); // Update total files count
  };

  // Function to copy the full URL (including prefix + secondRootCid) to clipboard
  const copyFullUrlToClipboard = () => {
    const fullUrl = `https://uneven-lavender-harrier.myfilebase.com/ipfs/+${secondRootCid}/`;
    navigator.clipboard
      .writeText(fullUrl)
      .then(() => {
        setMessage("Full URL copied to clipboard!");
      })
      .catch((err) => {
        setMessage("Failed to copy URL: " + err);
      });
  };

  return (
    <div>
      <h1 style={{ textAlign: "center" }}>Upload Folder</h1>
      <form
        id="uploadForm"
        onSubmit={handleFolderUpload}
        encType="multipart/form-data"
        style={{ textAlign: "center" }}
      >
        <input
          type="file"
          name="files"
          multiple
          webkitdirectory="true"
          directory="true"
          style={{
            display: "block",
            margin: "0 auto",
            padding: "10px",
            fontSize: "16px",
          }}
          onChange={handleFileSelection} // Add change handler to show file count
        />
        {totalFiles > 0 && (
          <p style={{ fontSize: "16px", color: "#333" }}>
            {totalFiles} file{totalFiles > 1 ? "s" : ""} selected
          </p>
        )}
        <button
          type="submit"
          disabled={uploading}
          style={{
            display: "block",
            margin: "20px auto",
            padding: "12px 24px",
            fontSize: "16px",
            fontWeight: "600",
            color: "#fff",
            background: uploading
              ? "#8c8c8c"
              : "linear-gradient(135deg, #4e74e6, #1d56f1)",
            border: "none",
            borderRadius: "8px",
            cursor: uploading ? "not-allowed" : "pointer",
            transition: "all 0.3s ease-in-out",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
          }}
        >
          {uploading ? "Uploading..." : "Upload"}
        </button>
      </form>
      {message && (
        <p
          style={{
            textAlign: "center",
            fontSize: "16px",
            fontWeight: "500",
            color: "#333",
          }}
        >
          {message}
        </p>
      )}
      {logs && <pre style={{ textAlign: "center", color: "#333" }}>{logs}</pre>}

      {/* Progress bar */}
      {uploading && (
        <div
          style={{
            marginTop: "20px",
            width: "100%",
            backgroundColor: "#f3f3f3",
            borderRadius: "8px",
          }}
        >
          <div
            style={{
              height: "10px",
              width: `${progress}%`,
              backgroundColor: "#4e74e6",
              borderRadius: "8px",
              transition: "width 0.5s ease-in-out",
            }}
          ></div>
        </div>
      )}

      {/* Conditionally render second Root CID after upload is complete */}
      {uploadComplete && secondRootCid && (
        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <p style={{ fontSize: "16px", color: "#333" }}>
            Second Root CID:{" "}
            <a
              href={`https://uneven-lavender-harrier.myfilebase.com/ipfs/+${secondRootCid}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {secondRootCid}
            </a>
          </p>
          {/* Copy Full URL button */}
          <button
            onClick={copyFullUrlToClipboard}
            style={{
              padding: "10px 20px",
              fontSize: "16px",
              fontWeight: "600",
              color: "#fff",
              background: "linear-gradient(135deg, #4e74e6, #1d56f1)",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              transition: "all 0.3s ease-in-out",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
            }}
          >
            Copy Full URL
          </button>
        </div>
      )}

      {/* Pass the data to the UpdateIpfsToContract component */}
      {uploadComplete && (
        <UpdateIpfsToContract
          ipfsLink={ipfsLink} // Pass IPFS link
          fileSize={Math.floor(fileSize / 2)} // Pass the adjusted file size (divided by 2)
          secondRootCid={secondRootCid} // Pass second Root CID
        />
      )}
    </div>
  );
}
