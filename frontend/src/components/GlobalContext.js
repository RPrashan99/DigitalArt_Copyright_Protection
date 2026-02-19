// GlobalContext.js
import { createContext, useState, useContext, useEffect } from 'react';

const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
  const [walletAddress, setWalletAddress] = useState(null);
  const [isRegistered, setIsRegistered] = useState(false);

  const saveWalletAddress = async (address) => {
    setWalletAddress(address);
    sessionStorage.setItem('wallet', address);
  }

  useEffect(() => {
    const wallet = sessionStorage.getItem('wallet');

    if(wallet){
      setWalletAddress(wallet);
    }
  }, [])

  return (
    <GlobalContext.Provider value={{ walletAddress, setWalletAddress, isRegistered, setIsRegistered, saveWalletAddress }}>
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalState = () => useContext(GlobalContext);