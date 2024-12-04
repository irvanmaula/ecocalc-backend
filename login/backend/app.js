require('dotenv').config();

const admin = require('firebase-admin');
const express = require('express');
const app = express();
const authRoutes = require('./src/routers/routeauth')


const serviceAccount = require('./serviceAccountKey.json');
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    projectId: process.env.PROJECT_ID
});

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

const db = admin.firestore();


app.use('/', authRoutes);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));