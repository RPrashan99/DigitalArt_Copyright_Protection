import express from 'express'
import multer from 'multer'
import cors from 'cors'
import { uploadToIPFS } from './ipfs.js'

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

const PORT = process.env.PORT || 5000;

app.use(cors());

app.post('/upload', upload.single("file"), async (req, res) => {
    try{
        if (!req.file) {
            return res.status(400).json({ error: "No file uploaded!" });
        }

        const ipfsPath = await uploadToIPFS(req.file.buffer);
        console.log("Uploaded to IPFS:", ipfsPath);
        res.json({ipfsPath});
    } catch(err){
        res.status(500).json({error: "IPFS upload failed!"})
    }
});

app.listen(PORT, ()=>
    console.log("Backend runnning on port ", PORT)
)