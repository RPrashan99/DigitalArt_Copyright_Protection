import { uploadToIPFS } from "../utils/ipfs";
import { generateHash } from "../utils/hash";
import { getContract } from "../utils/blockchain";

export default function UploadArt() {
  async function handleUpload(e) {
    const file = e.target.files[0];

    const artHash = await generateHash(file);
    const ipfsUrl = await uploadToIPFS(file);

    const contract = await getContract();
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
