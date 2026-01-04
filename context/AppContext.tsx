
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
  const [token, setToken] = useState<string | null>(jwtUtils.getToken());
  const [isLoading, setIsLoading] = useState(true);
  const [courses, setCourses] = useState<Course[]>([]);
  const [isExamHubOpen, setExamHubOpen] = useState(false);
  
  const [language, setLanguage] = useState<'ar' | 'en'>(() => {
    return (localStorage.getItem('nursy_lang') as 'ar' | 'en') || 'ar';
  });

  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    return (localStorage.getItem('nursy_theme') as 'light' | 'dark') || 'dark'; // Default to Dark
  });

  // Language Effect
  useEffect(() => {
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
    localStorage.setItem('nursy_lang', language);
  }, [language]);

  // Theme Effect
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('nursy_theme', theme);
  }, [theme]);

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'ar' ? 'en' : 'ar');
  };

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const getDeviceInfo = () => {
    const ua = navigator.userAgent;
    let device = "Desktop Browser";
    if (ua.match(/Android/i)) device = "Android Phone";
    else if (ua.match(/iPhone|iPad|iPod/i)) device = "iOS Device";
    else if (ua.match(/Windows/i)) device = "Windows PC";
    else if (ua.match(/Macintosh/i)) device = "MacBook";
    return device;
  };

  useEffect(() => {
    if (!db) return;
    const unsubscribe = db.collection("courses").onSnapshot((snapshot) => {
      if (snapshot.empty) {
        const batch = db.batch();
        defaultCourses.forEach((c) => {
          const ref = db.collection("courses").doc(c.id);
          batch.set(ref, c);
        });
        batch.commit().catch(e => console.error("Courses seed failed:", e));
      } else {
        const cloudCourses = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Course));
        setCourses(cloudCourses);
      }
    });
    return () => unsubscribe();
  }, []);

  const syncUserToCloud = async (userData: User) => {
    if (!db || !userData.id) return;
    try {
      await db.collection("users").doc(userData.id).set({
          ...userData,
          lastSeen: new Date().toISOString(),
          lastDevice: getDeviceInfo()
      }, { merge: true });
    } catch (e) {
      console.error("Sync Error:", e);
    }
  };

  // Critical Fix: Consolidated Auth State Management
  useEffect(() => {
    if (!auth) {
      setIsLoading(false);
      return;
    }

    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
      try {
        if (firebaseUser) {
          // 1. Fetch User Data
          const docRef = db.collection("users").doc(firebaseUser.uid);
          const docSnap = await docRef.get();
          
          let baseUser: User;
          
          if (docSnap.exists) {
            baseUser = { id: firebaseUser.uid, ...docSnap.data() } as User;
          } else {
            // 2. Auto-create if missing (Self-healing)
            baseUser = {
              id: firebaseUser.uid,
              name: firebaseUser.displayName || 'Student',
              email: firebaseUser.email || '',
              phone: '',
              xp: 0,
              level: 1,
              streak: 0,
              joinedAt: new Date().toISOString(),
              subscriptionTier: 'free'
            };
            await syncUserToCloud(baseUser);
          }
          
          setUser(baseUser);
          
          // 3. Generate Token
          const newToken = jwtUtils.sign({ sub: baseUser.id, name: baseUser.name, email: baseUser.email });
          jwtUtils.saveToken(newToken);
          setToken(newToken);
          
        } else {
          // 4. Clean Logout
          setUser(null);
          setToken(null);
          jwtUtils.removeToken();
        }
      } catch (error) {
        console.error("Auth State Change Error:", error);
        // Fallback safety
        setUser(null);
        setToken(null);
      } finally {
        // 5. Release Loading Lock
        setIsLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, pass: string) => { await auth.signInWithEmailAndPassword(email, pass); };
  
  const signup = async (email: string, pass: string, name: string, phone: string) => {
    const userCredential = await auth.createUserWithEmailAndPassword(email, pass);
    const firebaseUser = userCredential.user;
    if (firebaseUser) {
      await firebaseUser.updateProfile({ displayName: name });
      const newUser: User = { 
        id: firebaseUser.uid, name, email, phone, xp: 0, level: 1, streak: 0, joinedAt: new Date().toISOString(),
        subscriptionTier: 'free'
      };
      // Optimistic update
      setUser(newUser);
      await syncUserToCloud(newUser);
    }
  };

  const loginWithGoogle = async () => { await auth.signInWithPopup(googleProvider); };
  const logout = async () => { await auth.signOut(); jwtUtils.removeToken(); setUser(null); setToken(null); };
  
  const updateUserData = async (data: Partial<User>) => {
    if (!user) return;
    const updatedUser = { ...user, ...data };
    setUser(updatedUser);
    await syncUserToCloud(updatedUser);
  };

  const addCourse = async (course: Course) => { await db.collection("courses").doc(course.id).set(course); };
  const updateCourse = async (course: Course) => { await db.collection("courses").doc(course.id).set(course, { merge: true }); };
  const deleteCourse = async (id: string) => { await db.collection("courses").doc(id).delete(); };

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
