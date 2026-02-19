import express from 'express'
import multer from 'multer'
import cors from 'cors'
import { getFilesFromIPFS, getFromIPFS, uploadToIPFS } from './ipfs.js'

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

app.post('/getFile', express.json(), async (req, res) => {
  try {
    const { hash } = req.body;
    const content = await getFromIPFS(hash);
    res.header("Content-Type", "image/png");
    res.send(content);
  } catch (err) {
    res.status(500).json({ error: "Failed to retrieve file from IPFS!" });
  }
});

app.post('/getFiles', express.json(), async (req, res) => {
  try {
    const { hash } = req.body;
    const content = await getFilesFromIPFS(hash);
    const base64Images = content.map( (data) => 
        `data:image/png;base64,${data.toString("base64")}` 
    );
    res.json({ images: base64Images });
  } catch (err) {
    res.status(500).json({ error: "Failed to retrieve file from IPFS!" });
  }
});

app.listen(PORT, ()=>
    console.log("Backend runnning on port ", PORT)
)