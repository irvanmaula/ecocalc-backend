require('dotenv').config();
const express = require('express');
const FireStore = require('@google-cloud/firestore');

const app = express();
app.use(express.json());

const db = new FireStore({
    projectId: process.env.PROJECT_ID,
    keyFileName: process.env.GOOGLE_APPLICATION_CREDENTIALS,
});

app.get('/test-connection', async (req, res) => {
    try {
        const collections = await db.listCollections(); // Cek koleksi Firestore
        const collectionNames = collections.map((col) => col.id);
        res.status(200).send(`Connected to Firestore. Collections: ${collectionNames.join(', ')}`);
    } catch (error) {
        res.status(500).send(`Error connecting to Firestore: ${error.message}`);
    }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

// Test route
app.get('/', (req, res) => {
    res.send('Hello World!');
});