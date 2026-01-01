
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, SubscriptionTier, Course } from '../types';
import { courses as defaultCourses } from '../data/courses';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup,
  signOut, 
  onAuthStateChanged,
  updateProfile,
} from 'firebase/auth';
import { doc, setDoc, getDoc, collection, onSnapshot, writeBatch, addDoc, deleteDoc } from 'firebase/firestore';
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

  // Sync courses from Firestore in real-time
  useEffect(() => {
    if (!db) return;

    const unsubscribe = onSnapshot(collection(db, "courses"), (snapshot) => {
      if (snapshot.empty) {
        console.log("Firestore: Seeding default courses...");
        const batch = writeBatch(db);
        defaultCourses.forEach((c) => {
          const ref = doc(collection(db, "courses"), c.id);
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
      await addDoc(collection(db, "admin_notifications"), {
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
      await setDoc(doc(db, "users", userData.id), {
          ...userData,
          lastSeen: new Date().toISOString()
      }, { merge: true });
    } catch (e) {
      console.error("User Sync Error:", e);
    }
  };

  // Auth Listener
  useEffect(() => {
    if (!auth) {
      setIsLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const docRef = doc(db, "users", firebaseUser.uid);
          const docSnap = await getDoc(docRef);
          
          let baseUser: User;
          if (docSnap.exists()) {
            baseUser = { id: firebaseUser.uid, ...docSnap.data() } as User;
          } else {
            baseUser = {
              id: firebaseUser.uid,
              name: firebaseUser.displayName || 'طالب جديد',
              email: firebaseUser.email || '',
              phone: firebaseUser.phoneNumber || '',
              subscriptionTier: firebaseUser.email === 'toji123oodo@gmail.com' ? 'pro' : 'free'
            };
            await syncUserToCloud(baseUser);
          }
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
      await signInWithEmailAndPassword(auth, email, pass);
    } catch (error) {
      throw error;
    }
  };

  const signup = async (email: string, pass: string, name: string, phone: string, subscriptionTier: SubscriptionTier) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
      const firebaseUser = userCredential.user;
      await updateProfile(firebaseUser, { displayName: name });

      const newUser: User = {
          id: firebaseUser.uid,
          name: name,
          email: email,
          phone: phone,
          subscriptionTier: subscriptionTier
      };

      await syncUserToCloud(newUser);
      setUser(newUser);
      addAdminNotification('enrollment', `قام ${name} bإيصال حساب جديد بالبريد الإلكتروني.`, name);
    } catch (error) {
      throw error;
    }
  };

  const loginWithGoogle = async (): Promise<void> => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const firebaseUser = result.user;
      
      const docRef = doc(db, "users", firebaseUser.uid);
      const docSnap = await getDoc(docRef);
      
      if (!docSnap.exists()) {
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
          setUser({ id: firebaseUser.uid, ...docSnap.data() } as User);
      }
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    await signOut(auth);
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
    await setDoc(doc(db, "courses", course.id), course);
  };

  const updateCourse = async (course: Course) => {
    await setDoc(doc(db, "courses", course.id), course, { merge: true });
  };

  const deleteCourse = async (id: string) => {
    await deleteDoc(doc(db, "courses", id));
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
