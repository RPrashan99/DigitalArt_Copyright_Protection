// GlobalContext.js
import { createContext, useState, useContext } from 'react';

const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
  const [walletAddress, setWalletAddress] = useState(null);
  const [isRegistered, setIsRegistered] = useState(false);

  return (
    <GlobalContext.Provider value={{ walletAddress, setWalletAddress, isRegistered, setIsRegistered }}>
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalState = () => useContext(GlobalContext);