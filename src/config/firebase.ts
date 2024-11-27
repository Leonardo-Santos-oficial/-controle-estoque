import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import { enableIndexedDbPersistence } from "firebase/firestore"; 

const firebaseConfig = {
  apiKey: "AIzaSyBDcP77ygt9bKp4j8WHdVa50iWBntBFu40",
  authDomain: "controle-de-estoque-net.firebaseapp.com",
  projectId: "controle-de-estoque-net",
  storageBucket: "controle-de-estoque-net.firebasestorage.app",
  messagingSenderId: "459755778259",
  appId: "1:459755778259:web:6d2f04c45ec5214238e426"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Services
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

// Enable Firestore offline persistence
enableIndexedDbPersistence(db)
  .catch((err) => {
    if (err.code === 'failed-precondition') {
      console.log('Multiple tabs open, persistence can only be enabled in one tab at a a time.');
    } else if (err.code === 'unimplemented') {
      console.log('The current browser does not support all of the features required to enable persistence');
    }
});

export default app;
