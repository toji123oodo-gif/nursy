
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/compat/analytics';

/**
 * 💡 IMPORTANT: COPY AND PASTE THESE RULES INTO FIREBASE CONSOLE 💡
 * Go to Firestore Database > Rules, and paste exactly this:
 * 
 * rules_version = '2';
 * service cloud.firestore {
 *   match /databases/{database}/documents {
 *     match /courses/{courseId} {
 *       allow read: if true;
 *       allow write: if request.auth != null && 
 *         (request.auth.token.email == 'toji123oodo@gmail.com' || 
 *          request.auth.token.email == 'Mstfymdht542@gmail.com');
 *     }
 *     match /users/{userId} {
 *       allow read, write: if request.auth != null && (request.auth.uid == userId || 
 *         request.auth.token.email == 'toji123oodo@gmail.com' || 
 *         request.auth.token.email == 'Mstfymdht542@gmail.com');
 *     }
 *     match /{document=**} {
 *       allow read, write: if request.auth != null && 
 *         (request.auth.token.email == 'toji123oodo@gmail.com' || 
 *          request.auth.token.email == 'Mstfymdht542@gmail.com');
 *     }
 *   }
 * }
 */

const firebaseConfig = {
  apiKey: "AIzaSyCgk9AqmGYf6O2mtuMzseOrjtqRWPNJn0U",
  authDomain: "nursssssssyyy.firebaseapp.com",
  projectId: "nursssssssyyy",
  storageBucket: "nursssssssyyy.firebasestorage.app",
  messagingSenderId: "842999013358",
  appId: "1:842999013358:web:47d46c7ecf1267c33af8ff",
  measurementId: "G-KJJDXK8TEC"
};

const app = !firebase.apps.length ? firebase.initializeApp(firebaseConfig) : firebase.app();
const auth = firebase.auth();
auth.languageCode = 'ar'; 

const db = firebase.firestore();
db.settings({ ignoreUndefinedProperties: true });

if (typeof window !== 'undefined') {
  db.enablePersistence({ synchronizeTabs: true }).catch((err) => {
    if (err.code === 'failed-precondition') {
      console.warn("Multiple tabs open, persistence can only be enabled in one tab at a time.");
    } else if (err.code === 'unimplemented') {
      console.warn("The current browser doesn't support all of the features required to enable persistence");
    }
  });
}

const googleProvider = new firebase.auth.GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

let analytics: any;
if (typeof window !== 'undefined') {
  analytics = firebase.analytics();
}

export { auth, db, googleProvider, analytics };
