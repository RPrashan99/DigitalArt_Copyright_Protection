import { useEffect, useState } from "react";
import { getContract } from "../utils/blockchain.js";
import { useGlobalState } from "./GlobalContext.js";
import { getFromIPFS } from "../utils/ipfs.js";
import ArtTransfer from "./ArtTransfer.js";
import { ToastContainer, toast } from "react-toastify";
import "../App.css";

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
  const [artHashlist, setArtHashlist] = useState([]);
  const [selectedArt, setSelectedArt] = useState(null);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const getArtPieces = async () => {
    const contract = await getContract();
    await contract.getArtByOwner().then(async ([ipfsHashes, artHashes]) => {
      console.log('Art pieces owned by the user:', ipfsHashes);
      console.log('Art pieces hashes owned by the user:', artHashes);
      setArtHashlist(artHashes);
      const images = await getFromIPFS(ipfsHashes);
      images.map((image) => {
        console.log('Images:', image);
      });
      setArtList(images);
    }).catch((error) => {
      console.error('Error fetching art pieces:', error);
    });
  }

  const hadleTransfer = async (recipientAddress, artHash) => {
    console.log('Transferring art with hash:', artHash, 'to recipient:', recipientAddress);
    
    const contract = await getContract();

    contract.transferOwner(artHash, recipientAddress).then(() => {
      setSelectedArt(null);
      setShowTransferModal(false);
      setLoading(true);
    }).catch((error) => {
      console.error('Error transferring art:', error);
    });

    contract.on("OwnershipTransferred", (artHash, previousOwner, newOwner, timestamp) => {
      console.log(`Ownership transferred for art hash: ${artHash}`);
      console.log(`Previous Owner: ${previousOwner}`);
      console.log(`New Owner: ${newOwner}`);
      console.log(`Timestamp: ${timestamp}`);
      setSuccess(true);
    })
  }

  const handleTransferEnd = () => {
    setLoading(false);
    setSuccess(false);
    getArtPieces();
  }

  const handleCloseTransferModal = () => {
    setSelectedArt(null);
    setShowTransferModal(false);
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
                <div key={id} className="relative flex w-132 h-66 col-span-1 bg-gray-300 p-2 border rounded-lg shadow-lg hover:scale-105 transition-transform duration-300 justify-center items-center"
                  onClick={() => {
                    if (selectedArt === id) {
                      setSelectedArt(null);
                    } else {
                      setSelectedArt(id);
                    }
                  }}
                >
                  <img src={src} alt={`Art ${id + 1}`} className="w-128 h-64 object-cover rounded-lg shadow-md" />

                  {
                    selectedArt === id && (
                      <button className="absolute bottom-1 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-blue-600 text-lg text-white px-3 py-1 rounded shadow transition duration-300 ease-out animate-fadeIn" 
                        onClick={(e) => {
                          e.stopPropagation(); // prevent re-triggering
                          setShowTransferModal(true);
                        }}
                      >
                        Transfer
                      </button>
                  )}
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
      {
        showTransferModal && (
          <ArtTransfer 
            onClose={handleCloseTransferModal}
            onTransfer={hadleTransfer}
            artHash={selectedArt !== null ? artHashlist[selectedArt] : null}
            imageSrc={selectedArt !== null ? artList[selectedArt] : null}
          />
      )}
      {
        loading && (
          <div className="fixed flex inset-0 items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col justify-center items-center gap-2">
              <div className="bg-white p-2 rounded-lg text-xl font-bold">Ownership Transaction Status</div>
              <div className="flex text-gray-500 rounded-full overflow-hidden">
                Your transaction status will update automatically once the transfer is complete.
              </div>
              {
                success ? (
                  <div className="flex flex-col items-center gap-4">
                    <img src="/success.gif" alt="Success" className="w-12 h-12" />
                    <button className="flex bg-blue-600 text-lg text-white px-3 py-1 rounded shadow transition duration-300 ease-out animate-fadeIn"
                      onClick={handleTransferEnd}>
                      Okay
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-4">
                    <div className="text-lg font-semibold text-yellow-500">Please Wait</div>
                    <div className="spinner"></div>
                  </div>
                )
              }
            </div>
          </div>
        )
      }
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        theme="colored"
      />
    </div> 
  );
}