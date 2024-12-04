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


const HOST = '0.0.0.0';
const PORT = process.env.PORT || 8080;
app.listen(PORT,HOST, () => console.log(`Server running on http://${HOST}:${PORT}`));