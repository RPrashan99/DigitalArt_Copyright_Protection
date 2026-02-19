import {create} from 'ipfs-http-client';

const projectId = process.env.IPFS_PROJECT_ID;
const projectSecret = process.env.IPFS_PROJECT_SECRET

// const ipfs = create({
//   host: 'ipfs.infura.io',
//   port: 5001,
//   protocol: 'https',
//   headers: {
//     authorization: `Basic ${Buffer.from(`${projectId}:${projectSecret}`).toString('base64')}`,
//   },
// });

const ipfs = create({
  host: 'localhost',
  port: 5001,
  protocol: 'http',
});

export async function uploadToIPFS(content) {
  try {
    const {path} = await ipfs.add(content);
    //return `https://ipfs.infura.io/ipfs/${path}`;
    return path;
  } catch (error) {
    console.error('Error uploading to IPFS:', error);
    throw error;
  }
}

export async function getFromIPFS(hash) {
  try {
    const stream = ipfs.cat(hash);
    const chunks = [];
    for await (const chunk of stream) {
      chunks.push(chunk);
    }
    const data = Buffer.concat(chunks);
    return data;
  } catch (error) {
    console.error('Error fetching from IPFS:', error);
    throw error;
  }
}

export async function getFilesFromIPFS(hashes) {
  try{
    const results = await Promise.all(hashes.map(async (hash) => {
      const data = getFromIPFS(hash);
      return data;
    }));
    return results;
  }catch(err){
    console.error('Error fetching files from IPFS:', err);
    throw err;
  }
}