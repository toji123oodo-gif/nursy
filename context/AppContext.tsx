
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
import { auth, googleProvider, db } from '../src/firebase';

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
    try {
      await setDoc(doc(db, "users", userData.id), userData, { merge: true });
    } catch (e) {
      console.error("Failed to sync user to cloud", e);
    }
  };

  const checkSubscriptionValidity = (userData: User): User => {
    if (userData.subscriptionTier === 'pro' && userData.subscriptionExpiry) {
      const now = new Date();
      const expiry = new Date(userData.subscriptionExpiry);
      if (now > expiry) {
        return { ...userData, subscriptionTier: 'free' };
      }
    }
    return userData;
  };

  const getStoredUserData = async (uid: string) => {
    try {
      const docRef = doc(db, "users", uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return docSnap.data() as User;
      }
      return null;
    } catch (e) {
      console.error("Error fetching user data from Firestore:", e);
      return null;
    }
  };

  useEffect(() => {
    if (!auth) {
      setIsLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Step 1: Set a basic user immediately to unblock the UI
        const basicUser: User = {
          id: firebaseUser.uid,
          name: firebaseUser.displayName || 'طالب جديد',
          email: firebaseUser.email || '',
          phone: firebaseUser.phoneNumber || '',
          subscriptionTier: 'free'
        };
        
        // Admin override check
        if (firebaseUser.email === 'toji123oodo@gmail.com') {
          basicUser.subscriptionTier = 'pro';
        }

        setUser(basicUser);
        setIsLoading(false); // <--- UNBLOCK UI NOW

        // Step 2: Enrichment (fetch from Firestore in background)
        try {
          const storedData = await getStoredUserData(firebaseUser.uid);
          if (storedData) {
            let enrichedUser = { ...basicUser, ...storedData };
            enrichedUser = checkSubscriptionValidity(enrichedUser);
            setUser(enrichedUser);
            // Sync current state back
            syncUserToCloud(enrichedUser);
          }
        } catch (enrichError) {
          console.error("Enrichment failed", enrichError);
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

  const loginWithGoogleMock = async (): Promise<void> => {
    const mockUser: User = {
        id: 'google-mock-user-001',
        name: 'Demo Google User',
        email: 'demo.user@gmail.com',
        phone: '0000000000',
        subscriptionTier: 'free'
     };
     setUser(mockUser);
     setIsLoading(false);
  };

  const loginWithPhoneMock = async (phone: string): Promise<void> => {};

  const registerPhoneUser = async (uid: string | null, data: { name: string, phone: string, subscriptionTier: SubscriptionTier }) => {
    if (!uid) return;
    if (auth.currentUser) {
        try { await updateProfile(auth.currentUser, { displayName: data.name }); } catch(e) {}
    }

    const newUser = {
        id: uid,
        name: data.name,
        email: auth.currentUser?.email || '',
        phone: data.phone,
        subscriptionTier: data.subscriptionTier
    };

    await syncUserToCloud(newUser);
    setUser(prev => prev ? { ...prev, ...data } : newUser);
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
    if (auth.currentUser && data.name) {
      try { await updateProfile(auth.currentUser, { displayName: data.name }); } catch(e) {}
    }
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
