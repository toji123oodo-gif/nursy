
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics, isSupported } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyCgk9AqmGYf6O2mtuMzseOrjtqRWPNJn0U",
  authDomain: "nursssssssyyy.firebaseapp.com",
  projectId: "nursssssssyyy",
  storageBucket: "nursssssssyyy.firebasestorage.app",
  messagingSenderId: "842999013358",
  appId: "1:842999013358:web:47d46c7ecf1267c33af8ff",
  measurementId: "G-KJJDXK8TEC"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
auth.languageCode = 'ar'; 
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

let analytics: any;
isSupported().then(yes => {
  if (yes) {
    analytics = getAnalytics(app);
  }
}).catch(err => {
  console.warn("Firebase Analytics support warning:", err);
});

export { auth, db, googleProvider, analytics };
