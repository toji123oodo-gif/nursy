import { initializeApp } from 'firebase/app';
import { getAuth, Auth, GoogleAuthProvider } from 'firebase/auth';
import { getAnalytics, isSupported } from 'firebase/analytics';

// Access env variables safely by casting import.meta to any to avoid type errors
// when vite/client types are missing in the environment.
const env = (import.meta as any).env;

const firebaseConfig = {
  apiKey: env?.VITE_FIREBASE_API_KEY,
  authDomain: env?.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: env?.VITE_FIREBASE_PROJECT_ID,
  storageBucket: env?.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: env?.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: env?.VITE_FIREBASE_APP_ID,
  measurementId: env?.VITE_FIREBASE_MEASUREMENT_ID
};

let auth: Auth | undefined;
// Initialize provider immediately - it doesn't require the app instance to be ready
const googleProvider = new GoogleAuthProvider();
let analytics: any;

try {
  // Only initialize if config is present to avoid "auth/invalid-api-key" error
  if (firebaseConfig.apiKey) {
    const app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    
    // Safely initialize analytics only in supported environments
    isSupported().then(yes => {
      if (yes) analytics = getAnalytics(app);
    }).catch(() => {});
  } else {
    console.warn("Nursy: VITE_FIREBASE_API_KEY is missing. Firebase Auth is disabled.");
  }
} catch (error) {
  console.error("Nursy: Firebase initialization failed", error);
}

export { auth, googleProvider, analytics };