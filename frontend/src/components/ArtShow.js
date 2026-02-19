import { useEffect, useState } from "react";
import { getContract } from "../utils/blockchain.js";
import { useGlobalState } from "./GlobalContext.js";
import { getFromIPFS } from "../utils/ipfs.js";

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

  const {walletAddress} = useGlobalState();

  const [artList, setArtList] = useState([]);

  const getArtPieces = async () => {
    const contract = await getContract();
    await contract.getArtByOwner().then(async (artHashes) => {
      console.log('Art pieces owned by the user:', artHashes);
      const images = await getFromIPFS(artHashes);
      images.map((image) => {
        console.log('Images:', image);
      });
      setArtList(images);
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
    <div className="flex flex-col mx-10 bg-white overflow-hidden p-8 items-center">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">Art Show Component</h1>
      <div className="text-xl font-bold text-slate-600">All your digital art pieces are displayed here.</div>
      {
        walletAddress ? (
          artList.length > 0 ? (
            <div className="grid grid-cols-3 gap-4 mt-6 w-full p-2 border rounded-lg shadow-lg">
              {artList.map((src, id) => (
                <div key={id} className="flex col-span-1 bg-gray-300 p-2 border rounded-lg shadow-lg hover:scale-105 transition-transform duration-300 justify-center">
                  <img src={src} alt={`Art ${id + 1}`} className="w-128 h-auto rounded-lg shadow-md" />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center mt-6 text-gray-600">No art pieces found. Please mint some art to see them here.</div>
          )
        ) : (
          <div className="text-center mt-6 text-gray-600">Please connect your wallet to view your art pieces.</div>
        )
      }
    </div> 
  );
}