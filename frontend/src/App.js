import { useEffect, useState } from 'react';
import UploadArt from './components/UploadArt.js';
import VerifyArt from './components/VerifyArt.js';
import { getAccount, getContract } from './utils/blockchain.js';

function App() {
  let isRequestPending = false;

  const [account, setAccount] = useState('');
  const [contract, setContract] = useState(null);

  const connectWallet = async () => {
    if (window.ethereum) {
      if (isRequestPending) return;
      try {
        isRequestPending = true;
        const account = await getAccount();
        setAccount(account);

        console.log('Connected account:', account);

        const contractInstance = await getContract();
        setContract(contractInstance);
        
      } catch (error) {
        console.error('Wallet connection error:', error);
      } finally {
        isRequestPending = false;
      }
    } else {
      alert('Please install MetaMask!');
    }
  };

  useEffect(() => {
    connectWallet();
  }, []);

  return (
    <div style={{padding: "20px"}}>
      <h1>Digital Art Copyright Protection</h1>
      <div className="wallet-info">
        {account ? (
          <p>Connected: {account.substring(0, 6)}...{account.substring(38)}</p>
        ) : (
          <button onClick={connectWallet}>Connect Wallet</button>
        )}
      </div>
      <UploadArt />
      <hr />
      <VerifyArt />
    </div>
  );
}

export default App;
