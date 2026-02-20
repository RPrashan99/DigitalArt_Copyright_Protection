import { useState } from "react";


export default function ArtTransfer({onClose, onTransfer, artHash, imageSrc}) {

    const [walletAddress, setWalletAddress] = useState('');

    function shortenHash(hash) {

        if (!hash) return ""; 
        return `${hash.substring(0, 6)}...${hash.substring(hash.length - 4)}`; 
    }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-96 p-6">
        <h2 className="text-xl font-semibold mb-4">Transfer Art</h2>

        <img src={imageSrc} alt="Art preview" className="w-full rounded-md mb-4" />

        <p className="text-sm text-gray-600 mb-2">
          <strong>Art Hash:</strong> {shortenHash(artHash)}
        </p>

        <input type="text" placeholder="Enter recipient wallet address" value={walletAddress} onChange={(e) => setWalletAddress(e.target.value)}
          className="w-full border border-gray-300 rounded-md p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <div className="flex justify-end space-x-3">
          <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400" >
            Cancel
          </button>
          <button onClick={() => onTransfer(walletAddress, artHash)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Complete Transfer
          </button>
        </div>
      </div>
    </div>
  );
}