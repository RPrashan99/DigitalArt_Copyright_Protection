import {create} from 'ipfs-http-client';

const projectId = process.env.IPFS_PROJECT_ID;
const projectSecret = process.env.IPFS_PROJECT_SECRET

const ipfs = create({
  host: 'ipfs.infura.io',
  port: 5001,
  protocol: 'https',
  headers: {
    authorization: `Basic ${Buffer.from(`${projectId}:${projectSecret}`).toString('base64')}`,
  },
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