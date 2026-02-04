import { useEffect, useState } from 'react';
import { getAccount, getContract } from './utils/blockchain.js';
import NavBar from './components/NavBar.js';
import UploadArt from './components/UploadArt.js';
import VerifyArt from './components/VerifyArt.js';
import { useGlobalState } from './components/GlobalContext.js';

function App() {
  let isRequestPending = false;

  const {walletAddress, setWalletAddress} = useGlobalState();

  const [account, setAccount] = useState('');
  const [contract, setContract] = useState(null);

  const connectWallet = async () => {
    if (window.ethereum) {
      if (isRequestPending) return;
      try {
        isRequestPending = true;
        const account = await getAccount();
        setAccount(account);
        setWalletAddress(account);

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
    //connectWallet();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />
      <div className='flex flex-col lg:flex-row gap-16 justify-center items-center min-h-[85vh] px-8 md:px-20 py-12 bg-gradient-to-br from-slate-50 to-blue-50'>
        {/* Left Content Column */}
        <div className='flex flex-col w-full lg:w-1/2 space-y-8 animate-in fade-in slide-in-from-left duration-700'>
          <div className="space-y-4">
            <span className="text-blue-600 font-semibold tracking-widest uppercase text-sm px-3 py-1 bg-blue-100 rounded-full w-fit">
              Web3 Secured
            </span>
            <h1 className='text-6xl md:text-7xl font-extrabold text-slate-900 tracking-tight'>
              DART <span className="text-blue-600">Lock</span>
            </h1>
            <p className='text-xl md:text-2xl text-slate-600 leading-relaxed max-w-lg'>
              Decentralized copyright protection platform. 
              <span className="font-semibold text-slate-800"> Truly own </span> 
              your digital art on the blockchain.
            </p>
          </div>

          <div className="flex items-center gap-4">
            {walletAddress ? (
              <span className="text-green-600 font-medium">
                Wallet Connected
              </span>
            ) : (
              <button 
                className='bg-slate-900 hover:bg-blue-600 text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all transform hover:-translate-y-1 shadow-xl hover:shadow-blue-200 flex items-center gap-3' 
                onClick={connectWallet}
              >
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                Connect Wallet
              </button>
            )}
            
            <button className="text-slate-600 font-medium hover:text-blue-600 transition-colors">
              Learn More →
            </button>
          </div>
        </div>

        {/* Right Image Column */}
        <div className='flex w-full lg:w-1/2 justify-center relative'>
          {/* Decorative background element */}
          <div className="absolute -inset-4 bg-blue-200/30 rounded-full blur-3xl" />
          
          <div className='relative overflow-hidden rounded-[2.5rem] shadow-2xl border-8 border-white group'>
            <img 
              src="/Lock.jpg" 
              alt="Digital Artwork Protection" 
              className='object-cover w-full h-[400px] md:h-[500px] transition-transform duration-500 group-hover:scale-110'
            />
            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent" />
          </div>
        </div>
      </div>
      <div className='flex flex-row h-[90vh] p-10 gap-10'>
        <UploadArt />
        <VerifyArt />
      </div>
    </div>
  );
}

export default App;
