
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
  
  const OWNERS = ["toji123oodo@gmail.com", "Mstfymdht542@gmail.com"];

  const [language, setLanguage] = useState<'ar' | 'en'>(() => {
    return (localStorage.getItem('nursy_lang') as 'ar' | 'en') || 'ar';
  });

  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    return (localStorage.getItem('nursy_theme') as 'light' | 'dark') || 'dark';
  });

  useEffect(() => {
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
    localStorage.setItem('nursy_lang', language);
  }, [language]);

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('nursy_theme', theme);
  }, [theme]);

  const toggleLanguage = () => setLanguage(prev => (prev === 'ar' ? 'en' : 'ar'));
  const toggleTheme = () => setTheme(prev => (prev === 'light' ? 'dark' : 'light'));

  const getDeviceInfo = () => {
    const ua = navigator.userAgent;
    if (ua.match(/Android/i)) return "Android Phone";
    if (ua.match(/iPhone|iPad|iPod/i)) return "iOS Device";
    if (ua.match(/Windows/i)) return "Windows PC";
    if (ua.match(/Macintosh/i)) return "MacBook";
    return "Desktop Browser";
  };

  useEffect(() => {
    if (!db) return;
    const unsubscribe = db.collection("courses").onSnapshot((snapshot) => {
      if (snapshot.empty) {
        setCourses(defaultCourses);
      } else {
        const cloudCourses = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Course));
        setCourses(cloudCourses);
      }
    }, (error) => {
      console.error("Firestore Courses Listener Error:", error);
    });
    return () => unsubscribe();
  }, []);

  const syncUserToCloud = async (userData: User) => {
    if (!db || !userData.id) return;
    const isOwner = OWNERS.includes(userData.email);
    const updatedData = {
        ...userData,
        role: isOwner ? 'admin' : (userData.role || 'student'),
        lastSeen: new Date().toISOString(),
        lastDevice: getDeviceInfo()
    };
    db.collection("users").doc(userData.id).set(updatedData, { merge: true }).catch(err => console.error("Background sync failed", err));
  };

  useEffect(() => {
    if (!auth) {
      setIsLoading(false);
      return;
    }

    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
      if (firebaseUser) {
        const isOwner = OWNERS.includes(firebaseUser.email || '');
        const optimisticUser: User = {
          id: firebaseUser.uid,
          name: firebaseUser.displayName || 'Student',
          email: firebaseUser.email || '',
          phone: '',
          xp: 0,
          role: isOwner ? 'admin' : 'student',
          subscriptionTier: 'free',
          joinedAt: new Date().toISOString(),
        };

        if (!user) setUser(optimisticUser);
        
        const newToken = jwtUtils.sign({ 
           sub: optimisticUser.id, 
           name: optimisticUser.name, 
           email: optimisticUser.email,
           role: optimisticUser.role
        });
        jwtUtils.saveToken(newToken);
        setToken(newToken);
        setIsLoading(false);

        db.collection("users").doc(firebaseUser.uid).get().then((docSnap) => {
          if (docSnap.exists) {
            const userData = { ...docSnap.data(), id: firebaseUser.uid } as User;
            if (isOwner) userData.role = 'admin';
            setUser(userData);
            
            const updatedToken = jwtUtils.sign({ 
                sub: userData.id, 
                name: userData.name, 
                email: userData.email,
                role: userData.role
            });
            jwtUtils.saveToken(updatedToken);
          } else {
            syncUserToCloud(optimisticUser);
          }
        }).catch(err => {
            console.error("Error fetching user data:", err);
        });

      } else {
        setUser(null);
        setToken(null);
        jwtUtils.removeToken();
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
      const isOwner = OWNERS.includes(email);
      await db.collection("users").doc(firebaseUser.uid).set({
          name, email, phone,
          role: isOwner ? 'admin' : 'student',
          subscriptionTier: 'free',
          joinedAt: new Date().toISOString(),
          lastDevice: getDeviceInfo()
      });
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
              subscriptionTier: 'free',
              joinedAt: new Date().toISOString(),
              lastDevice: getDeviceInfo()
          });
      }
  };
  
  const logout = async () => { 
      await auth.signOut(); 
      jwtUtils.removeToken();
      setUser(null);
      window.location.href = '/';
  };
  
  const updateUserData = async (data: Partial<User>) => {
    if (!user) return;
    const updatedUser = { ...user, ...data };
    setUser(updatedUser); 
    syncUserToCloud(updatedUser);
  };

  const addCourse = async (course: Course) => { 
    if (!db) return;
    try {
      await db.collection("courses").doc(course.id).set(course); 
    } catch (e: any) {
      if (e.code === 'permission-denied') {
        alert("خطأ في الصلاحيات: يرجى التأكد من تحديث قواعد Firestore (Rules) في الكونسول.");
      }
      throw e;
    }
  };
  
  const updateCourse = async (course: Course) => { 
    if (!db) return;
    try {
      // استخدام set بدون merge لضمان استبدال المصفوفات (الدروس والمحتوى) بالكامل
      await db.collection("courses").doc(course.id).set(course); 
    } catch (e: any) {
      if (e.code === 'permission-denied') {
        alert("خطأ في الصلاحيات: يرجى التأكد من تحديث قواعد Firestore (Rules) في الكونسول.");
      }
      throw e;
    }
  };
  
  const deleteCourse = async (id: string) => { 
    if (!db) return;
    try {
      await db.collection("courses").doc(id).delete();
    } catch (e: any) {
      if (e.code === 'permission-denied') {
        alert("خطأ في الصلاحيات: لا تملك صلاحية حذف هذا الكورس.");
      }
      throw e;
    }
  };

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
