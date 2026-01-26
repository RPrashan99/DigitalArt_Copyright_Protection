import { uploadToIPFS } from "../utils/ipfs.js";
import { generateHash } from "../utils/hash.js";
import { getContract } from "../utils/blockchain.js";

export default function UploadArt() {
  async function handleUpload(e) {
    const file = e.target.files[0];

    console.log("Uploading file:", file.name);
    const artHash = await generateHash(file);
    console.log("Generated hash:", artHash);
    const ipfsUrl = await uploadToIPFS(file);
    console.log("IPFS URL:", ipfsUrl);

    const contract = await getContract();
    console.log("Contract:", contract);
    await contract.registerArt(artHash, ipfsUrl);

    alert("Artwork registered successfully!");
  }

  return (
    <div>
      <h2>Register Artwork</h2>
      <input type="file" onChange={handleUpload} />
    </div>
  );
}
