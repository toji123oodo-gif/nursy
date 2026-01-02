
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, SubscriptionTier, Course } from '../types';
import { courses as defaultCourses } from '../data/courses';
import firebase from 'firebase/compat/app';
import { auth, googleProvider, db } from '../firebase';

interface AppContextType {
  user: User | null;
  isLoading: boolean;
  courses: Course[];
  language: 'ar' | 'en';
  toggleLanguage: () => void;
  login: (email: string, pass: string) => Promise<void>;
  signup: (email: string, pass: string, name: string, phone: string, subscriptionTier: SubscriptionTier) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  upgradeToPro: () => void;
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
  const [isLoading, setIsLoading] = useState(true);
  const [courses, setCourses] = useState<Course[]>([]);
  const [isExamHubOpen, setExamHubOpen] = useState(false);
  const [language, setLanguage] = useState<'ar' | 'en'>(() => {
    return (localStorage.getItem('nursy_lang') as 'ar' | 'en') || 'ar';
  });

  useEffect(() => {
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
    localStorage.setItem('nursy_lang', language);
  }, [language]);

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'ar' ? 'en' : 'ar');
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

    const unsubscribe = db.collection("courses").onSnapshot(
      (snapshot) => {
        if (snapshot.empty) {
          const batch = db.batch();
          defaultCourses.forEach((c) => {
            const ref = db.collection("courses").doc(c.id);
            batch.set(ref, c);
          });
          batch.commit().catch(e => console.error("Initial courses seed failed:", e));
        } else {
          const cloudCourses: Course[] = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Course));
          setCourses(cloudCourses);
        }
      },
      (error) => {
        console.warn("Firestore Courses sync warning:", error);
        if (courses.length === 0) setCourses(defaultCourses);
      }
    );

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
    } catch (e) {}
  };

  useEffect(() => {
    if (!auth) {
      setIsLoading(false);
      return;
    }

    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const docRef = db.collection("users").doc(firebaseUser.uid);
          const docSnap = await docRef.get();
          
          let baseUser: User;
          if (docSnap.exists) {
            baseUser = { id: firebaseUser.uid, ...docSnap.data() } as User;
          } else {
            baseUser = {
              id: firebaseUser.uid,
              name: firebaseUser.displayName || 'طالب جديد',
              email: firebaseUser.email || '',
              phone: '',
              subscriptionTier: firebaseUser.email === 'toji123oodo@gmail.com' ? 'pro' : 'free'
            };
          }
          
          setUser(baseUser);
          syncUserToCloud(baseUser);
        } catch (error) {
          setUser({ id: firebaseUser.uid, name: firebaseUser.displayName || 'طالب', email: firebaseUser.email || '', phone: '', subscriptionTier: 'free' });
        } finally {
          setIsLoading(false);
        }
      } else {
        setUser(null);
        setIsLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, pass: string) => {
    await auth.signInWithEmailAndPassword(email, pass);
  };

  const signup = async (email: string, pass: string, name: string, phone: string, subscriptionTier: SubscriptionTier) => {
    const userCredential = await auth.createUserWithEmailAndPassword(email, pass);
    const firebaseUser = userCredential.user;
    if (firebaseUser) {
      await firebaseUser.updateProfile({ displayName: name });
      const newUser: User = { id: firebaseUser.uid, name, email, phone, subscriptionTier };
      setUser(newUser);
      await syncUserToCloud(newUser);
    }
  };

  const loginWithGoogle = async () => {
    const result = await auth.signInWithPopup(googleProvider);
    const firebaseUser = result.user;
    if (firebaseUser) {
        const docRef = db.collection("users").doc(firebaseUser.uid);
        const docSnap = await docRef.get().catch(() => null);
        let baseUser: User;
        if (docSnap && docSnap.exists) {
            baseUser = { id: firebaseUser.uid, ...docSnap.data() } as User;
        } else {
            baseUser = { id: firebaseUser.uid, name: firebaseUser.displayName || 'طالب جوجل', email: firebaseUser.email || '', phone: '', subscriptionTier: 'free' };
        }
        setUser(baseUser);
        await syncUserToCloud(baseUser);
    }
  };

  const logout = async () => {
    await auth.signOut();
    setUser(null);
  };

  const upgradeToPro = async () => {
    if (user) {
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + 30); 
      const updatedUser: User = { ...user, subscriptionTier: 'pro', subscriptionExpiry: expiryDate.toISOString() };
      setUser(updatedUser);
      await syncUserToCloud(updatedUser);
    }
  };

  const updateUserData = async (data: Partial<User>) => {
    if (!user) return;
    const updatedUser = { ...user, ...data };
    setUser(updatedUser);
    await syncUserToCloud(updatedUser);
  };

  const addCourse = async (course: Course) => {
    await db.collection("courses").doc(course.id).set(course);
  };

  const updateCourse = async (course: Course) => {
    await db.collection("courses").doc(course.id).set(course, { merge: true });
  };

  const deleteCourse = async (id: string) => {
    await db.collection("courses").doc(id).delete();
  };

  return (
    <AppContext.Provider value={{ 
        user, 
        isLoading, 
        courses,
        language,
        toggleLanguage,
        login, 
        signup,
        loginWithGoogle, 
        logout, 
        upgradeToPro, 
        updateUserData,
        addCourse,
        updateCourse,
        deleteCourse,
        isExamHubOpen,
        setExamHubOpen
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
