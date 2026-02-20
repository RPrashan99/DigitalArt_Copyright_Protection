import { useEffect, useState } from "react";
import { getAccount, getContract } from "../utils/blockchain.js";
import { useGlobalState } from "./GlobalContext.js";

export default function NavBar() {
  let isRequestPending = false;

  const {walletAddress, saveWalletAddress } = useGlobalState();

  const [account, setAccount] = useState('');
  const [contract, setContract] = useState(null);

  const connectWallet = async () => {
    if (window.ethereum) {
      if (isRequestPending) return;
      try {
        isRequestPending = true;
        const account = await getAccount();
        setAccount(account);
        saveWalletAddress(account);
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
    <nav className="sticky top-0 z-50 w-full backdrop-blur-md bg-white/70 border-b border-gray-200/50 px-6 py-4">
      <div className="max-w-7xl mx-auto flex flex-row justify-between items-center">
        
        {/* Logo Section */}
        <div className="flex items-center gap-2 group cursor-pointer">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200 transition-transform group-hover:rotate-12">
            <span className="text-white font-black text-xl italic">D</span>
          </div>
          <h1 className="text-2xl font-black tracking-tighter text-slate-900">
            DART <span className="text-blue-600">LOCK</span>
          </h1>
        </div>

        {/* Navigation Links */}
        <div className="hidden md:flex flex-row gap-8 items-center">
          {['Home', 'Art Show', 'How It Works', 'Help'].map((item) => (
            <a 
              key={item}
              href={`${item.toLowerCase().replace(/\s+/g, '')}`}
              className="text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors relative group"
            >
              {item}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all group-hover:w-full"></span>
            </a>
          ))}
        </div>

        {/* Action Section */}
        <div className="flex items-center gap-4">
          <button className="hidden sm:block text-sm font-bold text-slate-500 hover:text-slate-800 transition-colors">
            Sign In
          </button>
          <div className="flex flex-col items-center">
            {walletAddress ? (
              <p className="text-sm text-white bg-green-500 p-1 rounded-lg">Connected: {walletAddress.substring(0, 6)}...{walletAddress.substring(38)}</p>
            ) : (
              <button className="bg-slate-900 text-white px-6 py-2.5 rounded-full font-bold text-sm hover:bg-blue-600 hover:shadow-lg hover:shadow-blue-200 transition-all active:scale-95"
                onClick={connectWallet}>
                Connect Wallet
              </button>
            )}
          </div>
        </div>
        
      </div>
    </nav>
);
}