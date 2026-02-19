import { useEffect } from "react";
import { getContract } from "../utils/blockchain.js";
import { useGlobalState } from "./GlobalContext.js";

const list = [
  {
    id: 1,
    title: "Digital Art 1",
    path: "/Digital_Art.jpg"
  },
  {
    id: 2,
    title: "Digital Art 2",
    path: "/Digital_Art.jpg"
  },
  {
    id: 3,
    title: "Digital Art 3",
    path: "/Digital_Art.jpg"
  }
];

export default function ArtShow() {

  const {walletAddress, setWalletAddress} = useGlobalState();

  const getArtPieces = async () => {
    const contract = await getContract();
    await contract.getArtByOwner().then((artHashes) => {
      console.log('Art pieces owned by the user:', artHashes);
      // Here you would typically fetch the metadata for each art piece using the hash
    }).catch((error) => {
      console.error('Error fetching art pieces:', error);
    });
  }

  useEffect(() => {
    if (walletAddress) {
      getArtPieces();
    }
  },[walletAddress]);

  return (
    <div className="flex flex-col mx-10 bg-white overflow-hidden border p-8 items-center">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">Art Show Component</h1>
      <div className="text-xl font-bold text-slate-600">All your digital art pieces are displayed here.</div>
      {
        walletAddress ? (
          <div className="grid grid-cols-3 gap-4 mt-6 w-full p-2">
            {list.map((art) => (
              <div key={art.id} className="col-span-1 bg-gray-100 p-4 border rounded-lg shadow-lg hover:scale-105 transition-transform duration-300">
                <img src={art.path} alt={art.title} className="w-full h-auto rounded-lg shadow-md" />
                <div className="text-center mt-2 font-semibold">{art.title}</div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center mt-6 text-gray-600">Please connect your wallet to view your art pieces.</div>
        )
      }
    </div> 
  );
}