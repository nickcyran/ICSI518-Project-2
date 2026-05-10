// - [imports] --------------------------------------------------
const express = require('express');
const cors = require('cors');
const { Storage } = require('@google-cloud/storage');
const crypto = require('crypto');

// - [config] ---------------------------------------------------
const BUCKET_NAME = process.env.BUCKET_NAME || 'icsi-518-project-2';
const PORT = process.env.PORT || 3000;

const app = express();
app.use(cors({
    origin: [
        'http://localhost:3000',
        'https://nickcyran.github.io'
    ]
}));
app.use(express.json());

const bucket = new Storage().bucket(BUCKET_NAME);

// - [routes] ---------------------------------------------------
// get signed url to upload a file
app.post('/api/get-upload-url', async (req, res) => {
    const { contentType } = req.body;
    if (!contentType) 
        return res.status(400).json({ error: 'contentType required' });

    // generate a unique filename for the object
    const ext = (fileName?.split('.').pop() || 'bin').replace(/\W/g, '').toLowerCase();   // get formatted file extension (default to bin)
    const objectName = `${Date.now()}_${crypto.randomUUID()}.${ext}`;   // avoid collision w timestamp

    // sign a put url (valid for 15 min)
    const [uploadUrl] = await bucket.file(objectName).getSignedUrl({
        version: 'v4',
        action: 'write',
        expires: Date.now() + 15 * 60 * 1000,
        contentType,
    });

    res.json({ uploadUrl, objectName });
});

// get signed url to download a file (valid 7 days [max for v4])
app.post('/api/get-download-url', async (req, res) => {
    const { objectName } = req.body;
    if (!objectName) 
        return res.status(400).json({ error: 'objectName required' });

    // sign a get url valid for 7 days
    const [downloadUrl] = await bucket.file(objectName).getSignedUrl({
        version: 'v4',
        action: 'read',
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    });

    res.json({ downloadUrl });
});

// - [start] ----------------------------------------------------
app.listen(PORT, () => console.log(`Running at port ${PORT}`));