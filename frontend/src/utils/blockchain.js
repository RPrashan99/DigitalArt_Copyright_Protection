import {ethers, BrowserProvider} from 'ethers';
import ABI from '../contract/CopyrightABI.json';

const HARDHAT_CHAIN_ID = '0x7a69'; // 31337 in hex

// Connect to Ethereum blockchain using a provider
export const getProvider = () => {

    return new BrowserProvider(window.ethereum);
};

export async function getAccount() {

    await ensureCorrectNetwork();

    const provider = getProvider();
    const accounts = await provider.send("eth_requestAccounts", []);

    const network = await provider.getNetwork();
    console.log('Network:', network.chainId.toString());
    console.log('Network name:', network.name);

    const balance = await provider.getBalance(accounts[0]);
    console.log('Account:', accounts[0]);
    console.log('Balance:', ethers.formatEther(balance), 'ETH');

    return accounts[0];
}

export async function getContract() {
    const provider = getProvider();

    const signer = await provider.getSigner();
    
    return new ethers.Contract(
        process.env.REACT_APP_CONTRACT_ADDRESS,
        ABI,
        signer
    );
}

export async function ensureCorrectNetwork() {
    if (!window.ethereum) {
        throw new Error('Please install MetaMask!');
    }

    try {
        // Check current chain ID
        const chainId = await window.ethereum.request({ method: 'eth_chainId' });
        
        console.log('Current chain ID:', chainId);
        console.log('Expected chain ID:', HARDHAT_CHAIN_ID);
        
        if (chainId !== HARDHAT_CHAIN_ID) {
            console.log('Wrong network detected, attempting to switch...');
            
            try {
                // Try to switch to Hardhat network
                await window.ethereum.request({
                    method: 'wallet_switchEthereumChain',
                    params: [{ chainId: HARDHAT_CHAIN_ID }],
                });
                console.log('Switched to Hardhat Local');
            } catch (switchError) {
                // This error code indicates that the chain has not been added to MetaMask
                if (switchError.code === 4902) {
                    console.log('Hardhat network not found, adding it...');
                    
                    try {
                        await window.ethereum.request({
                            method: 'wallet_addEthereumChain',
                            params: [{
                                chainId: HARDHAT_CHAIN_ID,
                                chainName: 'Hardhat Local',
                                nativeCurrency: {
                                    name: 'Ethereum',
                                    symbol: 'ETH',
                                    decimals: 18
                                },
                                rpcUrls: ['http://127.0.0.1:8545'],
                            }],
                        });
                        console.log('Hardhat network added and switched');
                    } catch (addError) {
                        throw new Error('Failed to add Hardhat network: ' + addError.message);
                    }
                } else {
                    throw new Error('Failed to switch network: ' + switchError.message);
                }
            }
        } else {
            console.log('Already on correct network');
        }
        
        return true;
    } catch (error) {
        console.error('Network switch error:', error);
        throw error;
    }
}