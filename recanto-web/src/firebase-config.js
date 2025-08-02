import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyAqYFsDx062PKGVU7l46ezbyt3xFadFyvM",
  authDomain: "recantodospassaros-cfeea.firebaseapp.com",
  projectId: "recantodospassaros-cfeea",
  storageBucket: "recantodospassaros-cfeea.firebasestorage.app",
  messagingSenderId: "176963906771",
  appId: "1:176963906771:web:45e59f1b92fc5261f7f826"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);