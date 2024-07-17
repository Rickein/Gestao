const { initializeApp, getApps } = require('firebase/app');
const { getFirestore, collection, getDocs, getDoc, addDoc, doc, setDoc, deleteDoc, query, where } = require('firebase/firestore');
const { getAuth, GoogleAuthProvider, signInWithPopup } = require('firebase/auth');

const firebaseConfig = {
  apiKey: "AIzaSyA_-ghx3R12Q9XMXFifUQ1Ttj8UJEdbpxg",
  authDomain: "gestor-3fe87.firebaseapp.com",
  projectId: "gestor-3fe87",
  storageBucket: "gestor-3fe87.appspot.com",
  messagingSenderId: "826720251855",
  appId: "1:826720251855:web:29ee622d7369ce935facba"
};

let app;
if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

const db = getFirestore(app);
const auth = getAuth(app);

module.exports = { db, collection, getDocs, addDoc, doc, setDoc, getDoc, deleteDoc, query, where, auth, GoogleAuthProvider, signInWithPopup };