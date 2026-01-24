import {ethers, BrowserProvider} from 'ethers';
import ABI from '../contract/CopyrightABI.json';

// Connect to Ethereum blockchain using a provider
export const getProvider = () => {
    return new BrowserProvider(window.ethereum);
};

export async function getAccount() {
    const provider = getProvider();
    const accounts = await provider.send("eth_requestAccounts", []);
    return accounts[0];
}

export async function getContract() {
    const provider = getProvider();

    const signer = provider.getSigner();
    
    return new ethers.Contract(
        process.env.REACT_APP_CONTRACT_ADDRESS,
        ABI,
        signer
    );
}