const admin = require('firebase-admin');

const serviceAccount = require('../../submissionmlgc-berkaaldizar-firebase-adminsdk-b0zs4-497bb89d8b.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

module.exports = { admin, db }