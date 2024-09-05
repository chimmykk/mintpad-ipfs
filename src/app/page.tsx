// pages/index.js
import Head from 'next/head';
import DeployComponent from '../../components/DeployComponent';
import MintComponent from '../../components/MintComponent';
import UploadComponent from '../../components/UploadComponent'; // Import the new component

export default function Home() {
  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <Head>
        <title>MetaMask Deployment</title>
        <meta name="description" content="Next.js app with MetaMask deployment" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1 style={{ textAlign: 'center' }}>Mintpad v2 Test Deployment</h1>
        <div style={{ marginBottom: '40px' }}>
          <p style={{ textAlign: 'center', fontSize: '18px', fontWeight: 'bold' }}>Deploy Collection</p>
          <DeployComponent />
        </div>
        <div style={{ marginBottom: '40px' }}>
          <p style={{ textAlign: 'center', fontSize: '18px', fontWeight: 'bold' }}>Upload Folder</p>
          <UploadComponent /> {/* Add the UploadComponent here */}
        </div>
        <div style={{ marginBottom: '40px' }}>
          <p style={{ textAlign: 'center', fontSize: '18px', fontWeight: 'bold' }}>Mint NFTs</p>
          <MintComponent />
        </div>
      </main>

      <footer style={{ textAlign: 'center', padding: '10px', backgroundColor: '' }}>
        <p>Powered by Next.js</p>
      </footer>
    </div>
  );
}
