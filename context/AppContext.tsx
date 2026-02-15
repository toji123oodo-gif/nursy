
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Course } from '../types';
import { courses as defaultCourses } from '../data/courses';
import firebase from 'firebase/compat/app';
import { auth, googleProvider, db } from '../firebase';
import { jwtUtils } from '../utils/jwt';

interface AppContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  courses: Course[];
  language: 'ar' | 'en';
  theme: 'light' | 'dark';
  toggleLanguage: () => void;
  toggleTheme: () => void;
  login: (email: string, pass: string) => Promise<void>;
  signup: (email: string, pass: string, name: string, phone: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  updateUserData: (data: Partial<User>) => Promise<void>;
  addCourse: (course: Course) => Promise<void>;
  updateCourse: (course: Course) => Promise<void>;
  deleteCourse: (id: string) => Promise<void>;
  isExamHubOpen: boolean;
  setExamHubOpen: (isOpen: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [courses, setCourses] = useState<Course[]>([]);
  const [isExamHubOpen, setExamHubOpen] = useState(false);
  
  const OWNERS = ["toji123oodo@gmail.com", "Mstfymdht542@gmail.com"];

  // Safety Timeout: If loading takes too long, force stop it
  useEffect(() => {
    const timer = setTimeout(() => {
      if (isLoading) {
        console.warn("Auth check timed out, forcing UI to load.");
        setIsLoading(false);
      }
    }, 6000); // 6 seconds limit
    return () => clearTimeout(timer);
  }, [isLoading]);

  const [language, setLanguage] = useState<'ar' | 'en'>(() => {
    try { return (localStorage.getItem('nursy_lang') as 'ar' | 'en') || 'ar'; } catch(e) { return 'ar'; }
  });

  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    try { return (localStorage.getItem('nursy_theme') as 'light' | 'dark') || 'dark'; } catch(e) { return 'dark'; }
  });

  useEffect(() => {
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
    try { localStorage.setItem('nursy_lang', language); } catch(e) {}
  }, [language]);

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') root.classList.add('dark');
    else root.classList.remove('dark');
    try { localStorage.setItem('nursy_theme', theme); } catch(e) {}
  }, [theme]);

  const toggleLanguage = () => setLanguage(prev => (prev === 'ar' ? 'en' : 'ar'));
  const toggleTheme = () => setTheme(prev => (prev === 'light' ? 'dark' : 'light'));

  const getDeviceInfo = () => {
    const ua = navigator.userAgent;
    if (ua.match(/Android/i)) return "Android Phone";
    if (ua.match(/iPhone|iPad|iPod/i)) return "iOS Device";
    if (ua.match(/Windows/i)) return "Windows PC";
    if (ua.match(/Macintosh/i)) return "MacBook";
    return "Browser";
  };

  // Listen to Courses
  useEffect(() => {
    if (!db) return;
    const unsubscribe = db.collection("courses").onSnapshot((snapshot) => {
      if (!snapshot.empty) {
        setCourses(snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Course)));
      } else {
        setCourses(defaultCourses);
      }
    }, (error) => console.error("Courses Listener Error:", error));
    return () => unsubscribe();
  }, []);

  // Sync user data helper
  const syncUserToCloud = async (userData: User) => {
    if (!db || !userData.id) return;
    try {
      const isOwner = OWNERS.includes(userData.email);
      const updatedData = {
          ...userData,
          role: isOwner ? 'admin' : (userData.role || 'student'),
          subscriptionTier: 'pro',
          lastSeen: new Date().toISOString(),
          lastDevice: getDeviceInfo()
      };
      await db.collection("users").doc(userData.id).set(updatedData, { merge: true });
    } catch (err) { console.error("Sync failed", err); }
  };

  // Authentication Listener (Robust)
  useEffect(() => {
    if (!auth) {
      setIsLoading(false);
      return;
    }

    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
      try {
        if (firebaseUser) {
          const isOwner = OWNERS.includes(firebaseUser.email || '');
          
          // Try to fetch existing data
          const docSnap = await db.collection("users").doc(firebaseUser.uid).get().catch(() => null);
          
          let userData: User;
          if (docSnap && docSnap.exists) {
            userData = { ...docSnap.data(), id: firebaseUser.uid } as User;
            if (isOwner) userData.role = 'admin';
            if (userData.subscriptionTier !== 'pro') {
              userData.subscriptionTier = 'pro';
              db.collection("users").doc(firebaseUser.uid).update({ subscriptionTier: 'pro' }).catch(() => {});
            }
          } else {
            userData = {
              id: firebaseUser.uid,
              name: firebaseUser.displayName || 'Student',
              email: firebaseUser.email || '',
              phone: '',
              xp: 0,
              role: isOwner ? 'admin' : 'student',
              subscriptionTier: 'pro',
              joinedAt: new Date().toISOString(),
            };
            syncUserToCloud(userData);
          }

          setUser(userData);
          const newToken = jwtUtils.sign({ 
             sub: userData.id, name: userData.name, email: userData.email, role: userData.role 
          });
          jwtUtils.saveToken(newToken);
          setToken(newToken);
        } else {
          setUser(null);
          setToken(null);
          jwtUtils.removeToken();
        }
      } catch (err) {
        console.error("Auth process error", err);
      } finally {
        setIsLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, pass: string) => { await auth.signInWithEmailAndPassword(email, pass); };
  
  const signup = async (email: string, pass: string, name: string, phone: string) => {
    const userCredential = await auth.createUserWithEmailAndPassword(email, pass);
    if (userCredential.user) {
      await userCredential.user.updateProfile({ displayName: name });
      const isOwner = OWNERS.includes(email);
      const newUser: any = {
          name, email, phone,
          role: isOwner ? 'admin' : 'student',
          subscriptionTier: 'pro',
          joinedAt: new Date().toISOString(),
          lastDevice: getDeviceInfo()
      };
      await db.collection("users").doc(userCredential.user.uid).set(newUser);
    }
  };

  const loginWithGoogle = async () => { 
      const result = await auth.signInWithPopup(googleProvider); 
      if (result.user && result.additionalUserInfo?.isNewUser) {
          const isOwner = OWNERS.includes(result.user.email || '');
          await db.collection("users").doc(result.user.uid).set({
              name: result.user.displayName,
              email: result.user.email,
              role: isOwner ? 'admin' : 'student',
              subscriptionTier: 'pro',
              joinedAt: new Date().toISOString(),
              lastDevice: getDeviceInfo()
          });
      }
  };
  
  const logout = async () => { 
      await auth.signOut(); 
      jwtUtils.removeToken();
      setUser(null);
      setToken(null);
      window.location.href = '/';
  };
  
  const updateUserData = async (data: Partial<User>) => {
    if (!user) return;
    const updatedUser = { ...user, ...data };
    setUser(updatedUser); 
    syncUserToCloud(updatedUser);
  };

  const addCourse = async (course: Course) => { if (db) await db.collection("courses").doc(course.id).set(course); };
  const updateCourse = async (course: Course) => { if (db) await db.collection("courses").doc(course.id).set(course); };
  const deleteCourse = async (id: string) => { if (db) await db.collection("courses").doc(id).delete(); };

  return (
    <AppContext.Provider value={{ 
        user, token, isLoading, courses, language, theme, toggleLanguage, toggleTheme,
        login, signup, loginWithGoogle, logout, updateUserData,
        addCourse, updateCourse, deleteCourse, isExamHubOpen, setExamHubOpen
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) throw new Error('useApp must be used within an AppProvider');
  return context;
};
