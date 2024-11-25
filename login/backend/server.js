require('dotenv').config();

const admin = require('firebase-admin');
const express = require('express');
const app = express();


const serviceAccount = require('./serviceAccountKey.json');
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    projectId: process.env.PROJECT_ID
});

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

const db = admin.firestore();

app.get('/', async (req, res) => {
    const snapshot = await db.collection('test').get();
    let data = [];
    snapshot.forEach(doc => data.push(doc.data()));
    res.send(data);
});

db.collection('test').limit(1).get()
    .then(snapshot => {
        if (snapshot.empty) {
            console.log('Koneksi berhasil, tetapi koleksi "test" kosong.');
        } else {
            console.log('Koneksi berhasil dan koleksi "test" ditemukan.');
        }
    })
    .catch(error => {
        console.error('Gagal terhubung ke Firestore:', error);
    });




const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));