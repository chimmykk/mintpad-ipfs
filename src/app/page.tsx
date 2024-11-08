import Head from 'next/head';
import UploadComponent from './components/UploadComponent'; // Import the new component

export default function Home() {
  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px', fontFamily: '"Poppins", Arial, sans-serif', backgroundColor: '#f4f6f9', borderRadius: '15px', boxShadow: '0 6px 20px rgba(0, 0, 0, 0.1)', overflow: 'hidden', width: '100%' }}>
      <Head>
        <title>MetaMask Deployment</title>
        <meta name="description" content="Next.js app with MetaMask deployment" />
        <link rel="icon" href="/favicon.ico" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap" rel="stylesheet" />
      </Head>

      <main style={{ padding: '40px 20px', textAlign: 'center', width: '100%' }}>
        <h1 style={{ fontSize: '36px', fontWeight: '600', marginBottom: '30px', color: '#333' }}>Mintpad v2 Beta File Uploader</h1>

        {/* Upload Collection Section */}
        <div style={{ marginBottom: '40px', padding: '30px', backgroundColor: '#ffffff', borderRadius: '10px', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)', display: 'inline-block', width: '100%', boxSizing: 'border-box' }}>
          <p style={{ fontSize: '20px', fontWeight: '600', color: '#333', marginBottom: '20px' }}>Upload Collection</p>
          <p style={{ fontSize: '16px', color: '#777' }}>Choose a collection to upload. This section can be expanded with more functionality later.</p>
        </div>

        {/* Upload Folder Section */}
        <div style={{ marginBottom: '40px', padding: '30px', backgroundColor: '#ffffff', borderRadius: '10px', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)', display: 'inline-block', width: '100%', boxSizing: 'border-box' }}>
          <p style={{ fontSize: '20px', fontWeight: '600', color: '#333', marginBottom: '20px' }}>Upload Folder</p>
          <UploadComponent /> {/* Add the UploadComponent here */}
        </div>
      </main>

      {/* Footer */}
      <footer style={{ textAlign: 'center', padding: '20px', backgroundColor: '#ffffff', borderTop: '1px solid #ddd', marginTop: '40px', borderRadius: '0 0 15px 15px' }}>
        <p style={{ fontSize: '14px', color: '#666' }}>MintPad 2024 Copyright All Rights Reserved</p>
      </footer>
    </div>
  );
}
