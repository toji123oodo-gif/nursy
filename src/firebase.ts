
// Fix: Using compat version for namespaced Firebase v8 support to resolve property access errors
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/compat/analytics';

// Firebase configuration provided
const firebaseConfig = {
  apiKey: "AIzaSyCgk9AqmGYf6O2mtuMzseOrjtqRWPNJn0U",
  authDomain: "nursssssssyyy.firebaseapp.com",
  projectId: "nursssssssyyy",
  storageBucket: "nursssssssyyy.firebasestorage.app",
  messagingSenderId: "842999013358",
  appId: "1:842999013358:web:47d46c7ecf1267c33af8ff",
  measurementId: "G-KJJDXK8TEC"
};

// Initialize Firebase using namespaced syntax for compatibility
const app = !firebase.apps.length ? firebase.initializeApp(firebaseConfig) : firebase.app();

// Initialize Auth
const auth = firebase.auth();
// Set language to Arabic for SMS and ReCaptcha
auth.languageCode = 'ar'; 

// Initialize Firestore (Database)
const db = firebase.firestore();

// Initialize Google Provider
const googleProvider = new firebase.auth.GoogleAuthProvider();

// Initialize Analytics safely
let analytics: any;
if (typeof window !== 'undefined') {
  analytics = firebase.analytics();
}

export { auth, db, googleProvider, analytics };
