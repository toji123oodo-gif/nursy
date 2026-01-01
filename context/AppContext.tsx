
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, SubscriptionTier, Course } from '../types';
import { courses as defaultCourses } from '../data/courses';
// Fix: Using compat version for namespaced Firebase v8 support to resolve property access errors
import firebase from 'firebase/compat/app';
import { auth, googleProvider, db } from '../firebase';

interface AppContextType {
  user: User | null;
  isLoading: boolean;
  courses: Course[];
  login: (email: string, pass: string) => Promise<void>;
  signup: (email: string, pass: string, name: string, phone: string, subscriptionTier: SubscriptionTier) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  upgradeToPro: () => void;
  updateUserData: (data: Partial<User>) => Promise<void>;
  addCourse: (course: Course) => Promise<void>;
  updateCourse: (course: Course) => Promise<void>;
  deleteCourse: (id: string) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [courses, setCourses] = useState<Course[]>([]);

  // Function to get clean device info
  const getDeviceInfo = () => {
    const ua = navigator.userAgent;
    let device = "متصفح غير معروف";
    if (ua.match(/Android/i)) device = "Android Device";
    else if (ua.match(/iPhone|iPad|iPod/i)) device = "iOS Device";
    else if (ua.match(/Windows/i)) device = "Windows PC";
    else if (ua.match(/Macintosh/i)) device = "MacBook";
    else if (ua.match(/Linux/i)) device = "Linux System";
    
    return device;
  };

  useEffect(() => {
    if (!db) return;

    const unsubscribe = db.collection("courses").onSnapshot((snapshot) => {
      if (snapshot.empty) {
        console.log("Firestore: Seeding default courses...");
        const batch = db.batch();
        defaultCourses.forEach((c) => {
          const ref = db.collection("courses").doc(c.id);
          batch.set(ref, c);
        });
        batch.commit();
      } else {
        const cloudCourses: Course[] = [];
        snapshot.forEach((doc) => {
          cloudCourses.push({ id: doc.id, ...doc.data() } as Course);
        });
        setCourses(cloudCourses);
      }
    });

    return () => unsubscribe();
  }, []);

  const addAdminNotification = async (type: 'enrollment' | 'payment' | 'support', message: string, userName: string) => {
    if (!db) return;
    try {
      await db.collection("admin_notifications").add({
        type,
        message,
        userName,
        timestamp: new Date().toISOString(),
        read: false
      });
    } catch (e) {
      console.error("Failed to push admin notification", e);
    }
  };

  const syncUserToCloud = async (userData: User) => {
    if (!db || !userData.id) return;
    try {
      await db.collection("users").doc(userData.id).set({
          ...userData,
          lastSeen: new Date().toISOString(),
          lastDevice: getDeviceInfo() // Capture device on every sync
      }, { merge: true });
    } catch (e) {
      console.error("User Sync Error:", e);
    }
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
              phone: firebaseUser.phoneNumber || '',
              subscriptionTier: firebaseUser.email === 'toji123oodo@gmail.com' ? 'pro' : 'free'
            };
          }
          // Always sync to update lastSeen and lastDevice
          await syncUserToCloud(baseUser);
          setUser(baseUser);
        } catch (error) {
          console.error("Auth Sync Error:", error);
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

  const login = async (email: string, pass: string): Promise<void> => {
    try {
      await auth.signInWithEmailAndPassword(email, pass);
    } catch (error) {
      throw error;
    }
  };

  const signup = async (email: string, pass: string, name: string, phone: string, subscriptionTier: SubscriptionTier) => {
    try {
      const userCredential = await auth.createUserWithEmailAndPassword(email, pass);
      const firebaseUser = userCredential.user;
      if (firebaseUser) {
        await firebaseUser.updateProfile({ displayName: name });
        const newUser: User = {
            id: firebaseUser.uid,
            name: name,
            email: email,
            phone: phone,
            subscriptionTier: subscriptionTier
        };
        await syncUserToCloud(newUser);
        setUser(newUser);
        addAdminNotification('enrollment', `قام ${name} بإنشاء حساب جديد بالبريد الإلكتروني.`, name);
      }
    } catch (error) {
      throw error;
    }
  };

  const loginWithGoogle = async (): Promise<void> => {
    try {
      const result = await auth.signInWithPopup(googleProvider);
      const firebaseUser = result.user;
      
      if (firebaseUser) {
        const docRef = db.collection("users").doc(firebaseUser.uid);
        const docSnap = await docRef.get();
        
        if (!docSnap.exists) {
            const baseUser: User = {
              id: firebaseUser.uid,
              name: firebaseUser.displayName || 'طالب جوجل',
              email: firebaseUser.email || '',
              phone: firebaseUser.phoneNumber || '',
              subscriptionTier: firebaseUser.email === 'toji123oodo@gmail.com' ? 'pro' : 'free'
            };
            await syncUserToCloud(baseUser);
            addAdminNotification('enrollment', `قام ${baseUser.name} بالتسجيل عبر جوجل.`, baseUser.name);
            setUser(baseUser);
        } else {
            const existingUser = { id: firebaseUser.uid, ...docSnap.data() } as User;
            await syncUserToCloud(existingUser);
            setUser(existingUser);
        }
      }
    } catch (error) {
      throw error;
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
      const updatedUser: User = { 
        ...user, 
        subscriptionTier: 'pro',
        subscriptionExpiry: expiryDate.toISOString()
      };
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
        login, 
        signup,
        loginWithGoogle, 
        logout, 
        upgradeToPro, 
        updateUserData,
        addCourse,
        updateCourse,
        deleteCourse
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
