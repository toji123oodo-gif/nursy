
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics, isSupported } from 'firebase/analytics';

// Firebase configuration
// We use the provided hardcoded config to ensure the app initializes correctly.
const firebaseConfig = {
  apiKey: "AIzaSyCgk9AqmGYf6O2mtuMzseOrjtqRWPNJn0U",
  authDomain: "nursssssssyyy.firebaseapp.com",
  projectId: "nursssssssyyy",
  storageBucket: "nursssssssyyy.firebasestorage.app",
  messagingSenderId: "842999013358",
  appId: "1:842999013358:web:47d46c7ecf1267c33af8ff",
  measurementId: "G-KJJDXK8TEC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth
const auth = getAuth(app);
auth.languageCode = 'ar'; // Set language to Arabic for SMS/ReCaptcha

// Initialize Firestore (Database)
const db = getFirestore(app);

// Initialize Google Provider
const googleProvider = new GoogleAuthProvider();

// Initialize Analytics safely (not supported in all environments)
let analytics: any;
isSupported().then(yes => {
  if (yes) {
    analytics = getAnalytics(app);
  }
}).catch(err => {
  console.warn("Firebase Analytics support warning:", err);
});

export { auth, db, googleProvider, analytics };
