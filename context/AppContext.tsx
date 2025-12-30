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
import { auth, googleProvider } from '../src/firebase';

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

  // Initialize Courses
  useEffect(() => {
    const storedCourses = localStorage.getItem('nursy_courses');
    if (storedCourses) {
      setCourses(JSON.parse(storedCourses));
    } else {
      setCourses(defaultCourses);
      localStorage.setItem('nursy_courses', JSON.stringify(defaultCourses));
    }
  }, []);

  // Course Management
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

  // --- SYNC LOGIC ---
  const syncUserToMasterList = (userData: User) => {
    try {
      const masterListStr = localStorage.getItem('nursy_all_users_index');
      let masterList: User[] = masterListStr ? JSON.parse(masterListStr) : [];
      masterList = masterList.filter(u => u.id !== userData.id);
      masterList.push(userData);
      localStorage.setItem('nursy_all_users_index', JSON.stringify(masterList));
    } catch (e) {
      console.error("Failed to sync user to master list", e);
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

  const getStoredUserData = (uid: string) => {
    try {
      const data = localStorage.getItem(`nursy_user_data_${uid}`);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      return null;
    }
  };

  const saveUserDataToLocal = (uid: string, data: Partial<User>) => {
    const current = getStoredUserData(uid) || {};
    const fullData = { ...current, ...data };
    localStorage.setItem(`nursy_user_data_${uid}`, JSON.stringify(fullData));
  };

  useEffect(() => {
    // 1. Mock Mode Fallback
    if (!auth) {
      console.warn("Nursy: Auth not initialized.");
      const mockSession = localStorage.getItem('nursy_mock_session');
      if (mockSession) {
         setUser(JSON.parse(mockSession));
      }
      setIsLoading(false);
      return;
    }

    // 2. Real Firebase Listener
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        const localData = getStoredUserData(firebaseUser.uid);
        
        // Default mapping
        let mappedUser: User = {
          id: firebaseUser.uid,
          name: firebaseUser.displayName || localData?.name || 'Student',
          email: firebaseUser.email || localData?.email || '',
          phone: firebaseUser.phoneNumber || localData?.phone || '',
          subscriptionTier: localData?.subscriptionTier || 'free',
          subscriptionExpiry: localData?.subscriptionExpiry
        };

        // ADMIN OVERRIDE FOR GOOGLE ACCOUNT
        if (firebaseUser.email === 'toji123oodo@gmail.com') {
            mappedUser.subscriptionTier = 'pro';
            // Set expiry to far future for admin
            mappedUser.subscriptionExpiry = new Date(new Date().setFullYear(new Date().getFullYear() + 10)).toISOString();
        }

        mappedUser = checkSubscriptionValidity(mappedUser);
        
        // If local thinks Pro but validity says Free, update local
        if (localData?.subscriptionTier === 'pro' && mappedUser.subscriptionTier === 'free') {
            saveUserDataToLocal(firebaseUser.uid, { subscriptionTier: 'free' });
        }

        setUser(mappedUser);
        syncUserToMasterList(mappedUser);
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, pass: string): Promise<void> => {
    // Admin Backdoor
    if (email === '1221' && pass === '123') {
        const adminUser: User = {
            id: 'master-admin-001',
            name: 'Master Admin',
            email: 'admin@nursy.com',
            phone: '0000000000',
            subscriptionTier: 'pro'
        };
        setUser(adminUser);
        syncUserToMasterList(adminUser);
        return;
    }
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

    saveUserDataToLocal(firebaseUser.uid, {
        name,
        phone,
        subscriptionTier
    });

    setUser(newUser);
    syncUserToMasterList(newUser);
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
     saveUserDataToLocal(mockUser.id, { name: mockUser.name, subscriptionTier: 'free' });
     syncUserToMasterList(mockUser);
  };

  const loginWithPhoneMock = async (phone: string): Promise<void> => {
     // Handled via components directly
  };

  const registerPhoneUser = async (uid: string | null, data: { name: string, phone: string, subscriptionTier: SubscriptionTier }) => {
    if (!uid) return;
    
    if (auth.currentUser) {
        try { await updateProfile(auth.currentUser, { displayName: data.name }); } catch(e) {}
    }

    saveUserDataToLocal(uid, {
        name: data.name,
        phone: data.phone,
        subscriptionTier: data.subscriptionTier
    });
    
    setUser(prev => prev ? { ...prev, ...data } : null);
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
    localStorage.removeItem('nursy_mock_session');
  };

  const upgradeToPro = () => {
    if (user) {
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + 30); 

      const updatedUser: User = { 
        ...user, 
        subscriptionTier: 'pro',
        subscriptionExpiry: expiryDate.toISOString()
      };

      setUser(updatedUser);
      saveUserDataToLocal(user.id, { 
          subscriptionTier: 'pro',
          subscriptionExpiry: expiryDate.toISOString()
      });
      syncUserToMasterList(updatedUser);
    }
  };

  const updateUserData = async (data: Partial<User>) => {
    if (!user) return;
    
    if (auth.currentUser && data.name) {
      try { await updateProfile(auth.currentUser, { displayName: data.name }); } catch(e) {}
    }

    const updatedUser = { ...user, ...data };
    setUser(updatedUser);
    saveUserDataToLocal(user.id, data);
    syncUserToMasterList(updatedUser);
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