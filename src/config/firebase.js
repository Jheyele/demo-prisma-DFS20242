const admin = require('firebase-admin');
const serviceAccount = require('../../serviceAccountKey.json'); 

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: process.env.STORAGE_BUCKET_URL
});

const bucket = admin.storage().bucket();

module.exports = bucket;
