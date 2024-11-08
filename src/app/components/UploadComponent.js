// components/UploadComponent.js
"use client"
import { useState } from 'react';

export default function UploadComponent() {
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');
  const [logs, setLogs] = useState('');
  const [progress, setProgress] = useState(0);

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
    setProgress(0);

    try {
      const response = await fetch('/api/uploadFolder', {
        method: 'POST',
        body: formData,
        // Add a progress event listener
        onUploadProgress: (e) => {
          if (e.total > 0) {
            setProgress((e.loaded / e.total) * 100);
          }
        },
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
    <div style={{ maxWidth: '500px', margin: '0 auto', padding: '20px' }}>
      <h1 style={{ textAlign: 'center' }}>Upload Folder</h1>
      <form id="uploadForm" onSubmit={handleFolderUpload} encType="multipart/form-data">
        <input 
          type="file" 
          name="files" 
          multiple 
          webkitdirectory="true" 
          directory="true" 
          style={{ display: 'block', margin: '0 auto' }} 
        />
        
        <button 
          type="submit" 
          disabled={uploading} 
          style={{
            display: 'block', 
            margin: '10px auto', 
            padding: '10px 20px', 
            fontSize: '16px', 
            backgroundColor: '#4CAF50', 
            color: 'white', 
            border: 'none', 
            borderRadius: '5px', 
            cursor: 'pointer', 
            transition: 'background-color 0.3s ease'
          }}
        >
          {uploading ? 'Uploading...' : 'Upload'}
        </button>
      </form>

      {uploading && (
        <div style={{ marginTop: '20px' }}>
          <div 
            style={{
              height: '10px', 
              width: '100%', 
              backgroundColor: '#f3f3f3', 
              borderRadius: '5px', 
              overflow: 'hidden'
            }}
          >
            <div 
              style={{
                height: '100%', 
                width: `${progress}%`, 
                backgroundColor: '#4CAF50',
                transition: 'width 0.3s ease'
              }}
            />
          </div>
          <p style={{ textAlign: 'center', marginTop: '10px' }}>{Math.round(progress)}%</p>
        </div>
      )}

      {message && <p style={{ textAlign: 'center', marginTop: '20px' }}>{message}</p>}
      {logs && <pre style={{ textAlign: 'center', marginTop: '20px' }}>{logs}</pre>}
    </div>
  );
}
