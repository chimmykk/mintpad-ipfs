// components/UploadComponent.js
"use client"
import { useState } from 'react';

export default function UploadComponent() {
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');
  const [logs, setLogs] = useState('');

  const handleFolderUpload = async (event) => {
    event.preventDefault();
    
    const formData = new FormData();
    const files = event.target.files.files;

    if (files.length === 0) {
      setMessage('Please select a folder to upload.');
      return;
    }

    Array.from(files).forEach(file => {
      formData.append('files', file, file.webkitRelativePath);
    });

    setUploading(true);
    setMessage('');
    setLogs('');

    try {
      const response = await fetch('/api/uploadFolder', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        setMessage('Upload successful.');
        setLogs(result.logs);
      } else {
        setMessage('Upload failed.');
        setLogs(result.logs);
      }
    } catch (error) {
      setMessage('An error occurred during the upload.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <h1 style={{ textAlign: 'center' }}>Upload Folder</h1>
      <form id="uploadForm" onSubmit={handleFolderUpload} encType="multipart/form-data" style={{ textAlign: 'center' }}>
        <input 
          type="file" 
          name="files" 
          multiple 
          webkitdirectory="true" 
          directory="true" 
          style={{ display: 'block', margin: '0 auto' }} 
        />
        <button type="submit" disabled={uploading} style={{ display: 'block', margin: '10px auto' }}>
          {uploading ? 'Uploading...' : 'Upload'}
        </button>
      </form>
      {message && <p style={{ textAlign: 'center' }}>{message}</p>}
      {logs && <pre style={{ textAlign: 'center' }}>{logs}</pre>}
    </div>
  );
}
