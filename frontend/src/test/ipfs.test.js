import { uploadToIPFS } from "../utils/ipfs.js";

test('uploads a file to IPFS', async () => {
    const mockFile = new File(["dummy content"], "example.txt", { type: "text/plain" });

    const ipfsUrl = await uploadToIPFS(mockFile);
    console.log("Received IPFS URL:", ipfsUrl);

    expect(ipfsUrl).toMatch(/^Qm[1-9A-HJ-NP-Za-km-z]{44}$/);
});