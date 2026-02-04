import { generateHash } from "../utils/hash.js";
import { getContract } from "../utils/blockchain.js";
import { useState } from "react";

export default function VerifyArt() {

    const [file, setFile] = useState("");
    
    async function handleChange(e) {
      setFile(e.target.files[0]);
    }

    async function handleVerify(e){

      if(!file){
        alert("Please upload a file to verify.");
        return;
      }

      const hash = await generateHash(file);
      
      const contract = await getContract();
      const owner = await contract.verifyArt(hash);

      if(owner === "0x0000000000000000000000000000000000000000"){
          alert("This artwork is not registered.");
      } else {
          alert(`This artwork is owned by: ${owner}`);
      }
    }

    return (
        <div className='flex flex-col max-w-2xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100'>
      {/* Header Section */}
      <div className='p-8 pb-4 text-center'>
        <h2 className='text-3xl font-extrabold text-gray-900 tracking-tight'>Verify Digital Art</h2>
        <p className='text-gray-500 mt-2 text-lg'>Upload any art to the blockchain and verify ownership.</p>
      </div>

      {/* Image Preview Area */}
      <div className='px-8 py-4 flex justify-center'>
        <div className='relative group w-full aspect-video overflow-hidden rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 flex items-center justify-center'>
          {/* If preview exists, show art; otherwise show placeholder */}
          <img 
            src={file ? URL.createObjectURL(file) : "/Digital_Art.jpg"} 
            alt="Uploaded Art Preview" 
            className='object-cover w-full h-full transition-transform duration-300 group-hover:scale-105'
          />
        </div>
      </div>

      {/* Control Section */}
      <div className='p-8 pt-4 flex flex-col items-center gap-6'>
        {/* File Input Wrapper */}
        <label className="flex flex-col items-center w-full cursor-pointer">
          <input 
            type="file" 
            onChange={handleChange} 
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
        </label>

        <div className="flex flex-col items-center gap-4 w-full">
          <div className="text-sm font-medium flex items-center gap-2">
            <span className="text-gray-400 uppercase tracking-wider">Status:</span>
            {file ? (
              <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold ring-1 ring-green-600/20">
                Art Selected
              </span>
            ) : (
              <span className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-xs font-bold ring-1 ring-amber-600/20">
                Pending Upload
              </span>
            )}
          </div>

          <button 
            className="w-full sm:w-64 bg-blue-600 hover:bg-blue-700 active:scale-95 transition-all py-4 px-6 rounded-xl font-bold text-white shadow-lg shadow-blue-200 flex justify-center items-center gap-3"
            onClick={handleVerify}
          >
            <span>Verify Art</span>
            <img src="/Verify.png" alt="" className="w-5 h-5 invert" />
          </button>
        </div>
      </div>
    </div>
    );
}