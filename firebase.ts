
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/compat/analytics';

// Firebase configuration
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
const app = !firebase.apps.length ? firebase.initializeApp(firebaseConfig) : firebase.app();

// Initialize Auth
const auth = firebase.auth();
auth.languageCode = 'ar'; 

// Initialize Firestore
const db = firebase.firestore();

// IMPORTANT: Ignore undefined properties to prevent "Unsupported field value: undefined" errors
db.settings({ ignoreUndefinedProperties: true });

// Standard persistence settings - removed experimentalForceLongPolling as it causes hangs
if (typeof window !== 'undefined') {
  db.enablePersistence({ synchronizeTabs: true }).catch((err) => {
    if (err.code === 'failed-precondition') {
      console.warn("Multiple tabs open, persistence can only be enabled in one tab at a time.");
    } else if (err.code === 'unimplemented') {
      console.warn("The current browser doesn't support all of the features required to enable persistence");
    }
  });
}

// Initialize Google Provider
const googleProvider = new firebase.auth.GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

// Initialize Analytics safely
let analytics: any;
if (typeof window !== 'undefined') {
  analytics = firebase.analytics();
  // Debug: Log current domain for Authorized Domain setup
  console.log("%c[Firebase Auth] Current Domain:", "color: #F38020; font-weight: bold;", window.location.hostname);
  console.log("Add this domain to Firebase Console > Authentication > Settings > Authorized domains if you see 'auth/unauthorized-domain' error.");
}

export { auth, db, googleProvider, analytics };
