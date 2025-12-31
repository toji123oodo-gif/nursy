
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
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, googleProvider, db } from '../firebase';

interface AppContextType {
  user: User | null;
  isLoading: boolean;
  courses: Course[];
  login: (email: string, pass: string) => Promise<void>;
  signup: (email: string, pass: string, name: string, phone: string, subscriptionTier: SubscriptionTier) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  loginWithGoogleMock: () => Promise<void>;
  loginWithPhoneMock: (phone: string) => Promise<void>;
  registerPhoneUser: (uid: string | null, data: { name: string, phone: string, subscriptionTier: SubscriptionTier }) => Promise<void>;
  logout: () => Promise<void>;
  upgradeToPro: () => void;
  updateUserData: (data: Partial<User>) => Promise<void>;
  addCourse: (course: Course) => void;
  updateCourse: (course: Course) => void;
  deleteCourse: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {
    const storedCourses = localStorage.getItem('nursy_courses');
    if (storedCourses) {
      setCourses(JSON.parse(storedCourses));
    } else {
      setCourses(defaultCourses);
      localStorage.setItem('nursy_courses', JSON.stringify(defaultCourses));
    }
  }, []);

  const addCourse = (course: Course) => {
    const updatedCourses = [...courses, course];
    setCourses(updatedCourses);
    localStorage.setItem('nursy_courses', JSON.stringify(updatedCourses));
  };

  const updateCourse = (course: Course) => {
    const updatedCourses = courses.map(c => c.id === course.id ? course : c);
    setCourses(updatedCourses);
    localStorage.setItem('nursy_courses', JSON.stringify(updatedCourses));
  };

  const deleteCourse = (id: string) => {
    const updatedCourses = courses.filter(c => c.id !== id);
    setCourses(updatedCourses);
    localStorage.setItem('nursy_courses', JSON.stringify(updatedCourses));
  };

  const syncUserToCloud = async (userData: User) => {
    if (!db || !userData.id) return;
    try {
      console.log("Admin Sync: Syncing user", userData.id);
      await setDoc(doc(db, "users", userData.id), {
          ...userData,
          lastLogin: new Date().toISOString()
      }, { merge: true });
    } catch (e) {
      console.error("Admin Sync Error:", e);
    }
  };

  useEffect(() => {
    if (!auth) {
      setIsLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        let baseUser: User = {
          id: firebaseUser.uid,
          name: firebaseUser.displayName || 'طالب جديد',
          email: firebaseUser.email || '',
          phone: firebaseUser.phoneNumber || '',
          subscriptionTier: firebaseUser.email === 'toji123oodo@gmail.com' ? 'pro' : 'free'
        };
        
        try {
          const docRef = doc(db, "users", firebaseUser.uid);
          const docSnap = await getDoc(docRef);
          
          if (docSnap.exists()) {
            const cloudData = docSnap.data() as User;
            baseUser = { ...baseUser, ...cloudData };
            setUser(baseUser);
          } else {
            // New user (like Google login), sync immediately
            await syncUserToCloud(baseUser);
            setUser(baseUser);
          }
        } catch (error) {
          console.error("Sync background failed:", error);
          setUser(baseUser);
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
    await signInWithEmailAndPassword(auth, email, pass);
  };

  const signup = async (email: string, pass: string, name: string, phone: string, subscriptionTier: SubscriptionTier) => {
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
  };

  const loginWithGoogle = async (): Promise<void> => {
    await signInWithPopup(auth, googleProvider);
  };

  const loginWithGoogleMock = async (): Promise<void> => {};
  const loginWithPhoneMock = async (phone: string): Promise<void> => {};

  const registerPhoneUser = async (uid: string | null, data: { name: string, phone: string, subscriptionTier: SubscriptionTier }) => {
    if (!uid) return;
    const newUser: User = {
        id: uid,
        name: data.name,
        email: auth.currentUser?.email || '',
        phone: data.phone,
        subscriptionTier: data.subscriptionTier
    };
    await syncUserToCloud(newUser);
    setUser(newUser);
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

  return (
    <AppContext.Provider value={{ 
        user, 
        isLoading, 
        courses,
        login, 
        signup,
        loginWithGoogle, 
        loginWithGoogleMock,
        loginWithPhoneMock, 
        registerPhoneUser,
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
