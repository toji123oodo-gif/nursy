
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/compat/analytics';

// Firebase configuration
// تم استخدام القيم الموفرة للمشروع مع إمكانية القراءة من متغيرات البيئة لسهولة الإدارة
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
auth.languageCode = 'ar'; // تعيين اللغة للعربية لرسائل التحقق

// Initialize Firestore
const db = firebase.firestore();

// Initialize Google Provider
const googleProvider = new firebase.auth.GoogleAuthProvider();
// تخصيص المطالبة بالحساب لضمان ظهور نافذة اختيار الحساب دائماً
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

// Initialize Analytics safely
let analytics: any;
if (typeof window !== 'undefined') {
  analytics = firebase.analytics();
}

export { auth, db, googleProvider, analytics };
