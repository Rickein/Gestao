const admin = require('firebase-admin');

let firebaseApp;

if (!admin.apps.length) {
  const serviceAccount = require('./creds.json'); 
  firebaseApp = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
} else {
  firebaseApp = admin.app(); 
}

module.exports = firebaseApp;