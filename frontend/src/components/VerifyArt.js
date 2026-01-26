import { generateHash } from "../utils/hash.js";
import { getContract } from "../utils/blockchain.js";

export default function VerifyArt() {

    async function handleVerify(e){
        e.preventDefault();
        const file = e.target.files[0];
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
        <div>
            <h2>Verify Artwork</h2>
            <input type="file" onChange={handleVerify} />
        </div>
    );
}