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
  loginWithGoogle: () => Promise<void>;
  loginWithPhoneMock: (phone: string) => Promise<void>;
  signup: (data: Omit<User, 'id'> & { password?: string }) => Promise<void>;
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

  // Course Management Functions
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

  // --- MASTER INDEX LOGIC (Simulates a Database for Admin) ---
  const syncUserToMasterList = (userData: User) => {
    try {
      const masterListStr = localStorage.getItem('nursy_all_users_index');
      let masterList: User[] = masterListStr ? JSON.parse(masterListStr) : [];
      
      // Remove old entry if exists to avoid duplicates
      masterList = masterList.filter(u => u.id !== userData.id);
      
      // Add updated user
      masterList.push(userData);
      
      localStorage.setItem('nursy_all_users_index', JSON.stringify(masterList));
    } catch (e) {
      console.error("Failed to sync user to master list", e);
    }
  };
  // -----------------------------------------------------------

  // Helper to check if subscription is valid
  const checkSubscriptionValidity = (userData: User): User => {
    if (userData.subscriptionTier === 'pro' && userData.subscriptionExpiry) {
      const now = new Date();
      const expiry = new Date(userData.subscriptionExpiry);
      
      // If expired, downgrade to free
      if (now > expiry) {
        return { ...userData, subscriptionTier: 'free' };
      }
    }
    return userData;
  };

  // Helper to get extra user data from localStorage since we don't have a DB yet
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
    // 1. If Firebase Auth is not initialized (missing keys), check for Mock Session
    if (!auth) {
      console.warn("Nursy: Firebase Auth not initialized (Missing API Key). Running in Mock Mode.");
      const mockSession = localStorage.getItem('nursy_mock_session');
      if (mockSession) {
        try {
          const parsedUser = JSON.parse(mockSession);
          const validatedUser = checkSubscriptionValidity(parsedUser);
          setUser(validatedUser);
          syncUserToMasterList(validatedUser); // Sync on load
          
          // Update storage if changed (expired)
          if (validatedUser.subscriptionTier !== parsedUser.subscriptionTier) {
             localStorage.setItem('nursy_mock_session', JSON.stringify(validatedUser));
          }
        } catch (e) {
          localStorage.removeItem('nursy_mock_session');
        }
      }
      setIsLoading(false);
      return;
    }

    // 2. Real Firebase Listener
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        // Map Firebase User to App User
        const localData = getStoredUserData(firebaseUser.uid);
        
        let mappedUser: User = {
          id: firebaseUser.uid,
          name: firebaseUser.displayName || localData?.name || 'Student',
          email: firebaseUser.email || `phone_${firebaseUser.phoneNumber}` || '',
          phone: firebaseUser.phoneNumber || localData?.phone || '',
          subscriptionTier: localData?.subscriptionTier || 'free',
          subscriptionExpiry: localData?.subscriptionExpiry
        };

        // Check expiry
        mappedUser = checkSubscriptionValidity(mappedUser);
        
        // If status changed due to expiry, save it
        if (localData?.subscriptionTier === 'pro' && mappedUser.subscriptionTier === 'free') {
            saveUserDataToLocal(firebaseUser.uid, { subscriptionTier: 'free' });
        }

        setUser(mappedUser);
        syncUserToMasterList(mappedUser); // Sync on auth state change
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, pass: string): Promise<void> => {
    // --- SECRET ADMIN BACKDOOR ---
    if (email === '1221' && pass === '123') {
        const adminUser: User = {
            id: 'master-admin-001',
            name: 'Master Admin',
            email: 'admin@nursy.com',
            phone: '0000000000',
            subscriptionTier: 'pro'
        };
        setUser(adminUser);
        localStorage.setItem('nursy_mock_session', JSON.stringify(adminUser));
        syncUserToMasterList(adminUser);
        return;
    }
    // -----------------------------

    if (!auth) {
      // Mock Login
      console.log("Mock Mode: Logging in...");
      await new Promise(resolve => setTimeout(resolve, 800)); 
      
      // Simulate fetching from our fake "Master DB" to find user by email
      const masterListStr = localStorage.getItem('nursy_all_users_index');
      const masterList: User[] = masterListStr ? JSON.parse(masterListStr) : [];
      const foundUser = masterList.find(u => u.email === email);

      let mockUser: User;
      if (foundUser) {
          mockUser = foundUser;
      } else {
           // Create new mock user if not found (Simulation behavior)
          mockUser = {
            id: 'mock-user-' + Math.floor(Math.random() * 10000),
            name: 'Demo Student',
            email: email,
            phone: '01000000000',
            subscriptionTier: 'free'
          };
      }
      
      // Load existing mock data if any specific override exists
      const existing = getStoredUserData(mockUser.id);
      const finalUser = existing ? { ...mockUser, ...existing } : mockUser;
      
      const validated = checkSubscriptionValidity(finalUser);
      setUser(validated);
      localStorage.setItem('nursy_mock_session', JSON.stringify(validated));
      saveUserDataToLocal(validated.id, { 
          name: validated.name, 
          subscriptionTier: validated.subscriptionTier,
          subscriptionExpiry: validated.subscriptionExpiry 
      });
      syncUserToMasterList(validated);
      return;
    }
    await signInWithEmailAndPassword(auth, email, pass);
  };

  const loginWithGoogle = async (): Promise<void> => {
    if (!auth) {
      // Mock Google Login
      console.log("Mock Mode: Google Login...");
      await new Promise(resolve => setTimeout(resolve, 800));
      const mockUser: User = {
        id: 'mock-google-' + Date.now(),
        name: 'Google User (Demo)',
        email: 'demo.google@nursy.com',
        phone: '',
        subscriptionTier: 'free'
      };
      setUser(mockUser);
      localStorage.setItem('nursy_mock_session', JSON.stringify(mockUser));
      saveUserDataToLocal(mockUser.id, { name: mockUser.name, subscriptionTier: 'free' });
      syncUserToMasterList(mockUser);
      return;
    }

    if (!googleProvider) throw new Error("Google Auth Provider failed to initialize.");
    
    const result = await signInWithPopup(auth, googleProvider);
    const localData = getStoredUserData(result.user.uid);
    if (!localData) {
      saveUserDataToLocal(result.user.uid, {
        name: result.user.displayName || 'Student',
        subscriptionTier: 'free'
      });
    }
    // syncUserToMasterList is handled by onAuthStateChanged
  };

  const loginWithPhoneMock = async (phone: string): Promise<void> => {
    // Only used when !auth
    console.log("Mock Mode: Phone Login...");
    await new Promise(resolve => setTimeout(resolve, 800));
    const mockUser: User = {
      id: 'mock-phone-' + Date.now(),
      name: 'Phone User',
      email: '',
      phone: phone,
      subscriptionTier: 'free'
    };
    setUser(mockUser);
    localStorage.setItem('nursy_mock_session', JSON.stringify(mockUser));
    saveUserDataToLocal(mockUser.id, { name: mockUser.name, phone: phone, subscriptionTier: 'free' });
    syncUserToMasterList(mockUser);
  };

  const signup = async (data: Omit<User, 'id'> & { password?: string }) => {
    if (!auth) {
      // Mock Signup
      console.log("Mock Mode: Signing up...");
      await new Promise(resolve => setTimeout(resolve, 800));
      const mockUser: User = {
        id: 'mock-user-' + Date.now(),
        name: data.name,
        email: data.email,
        phone: data.phone,
        subscriptionTier: data.subscriptionTier
      };
      setUser(mockUser);
      localStorage.setItem('nursy_mock_session', JSON.stringify(mockUser));
      saveUserDataToLocal(mockUser.id, { 
        name: data.name, 
        phone: data.phone, 
        subscriptionTier: data.subscriptionTier
      });
      syncUserToMasterList(mockUser);
      return;
    }

    if (!data.password) throw new Error("Password is required");
    
    const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
    
    if (auth.currentUser) {
      await updateProfile(auth.currentUser, {
        displayName: data.name
      });
      
      saveUserDataToLocal(userCredential.user.uid, {
        name: data.name,
        phone: data.phone,
        subscriptionTier: data.subscriptionTier
      });
      
      const newUser = {
        id: userCredential.user.uid,
        name: data.name,
        email: data.email,
        phone: data.phone,
        subscriptionTier: data.subscriptionTier
      };
      setUser(newUser);
      syncUserToMasterList(newUser);
    }
  };

  const logout = async () => {
    if (auth) {
      await signOut(auth);
    }
    setUser(null);
    localStorage.removeItem('nursy_mock_session');
    // Note: We DO NOT remove user data or master list on logout, as admins need it.
  };

  const upgradeToPro = () => {
    if (user) {
      // ACTIVATE FOR 30 DAYS
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + 30); // Add 30 days

      const updatedUser: User = { 
        ...user, 
        subscriptionTier: 'pro',
        subscriptionExpiry: expiryDate.toISOString()
      };

      setUser(updatedUser);
      
      // Persist
      saveUserDataToLocal(user.id, { 
          subscriptionTier: 'pro',
          subscriptionExpiry: expiryDate.toISOString()
      });
      
      syncUserToMasterList(updatedUser);
      
      // Update mock session
      if (!auth || user.id.startsWith('master-admin')) {
        localStorage.setItem('nursy_mock_session', JSON.stringify(updatedUser));
      }
    }
  };

  const updateUserData = async (data: Partial<User>) => {
    if (!user) return;
    
    if (auth && auth.currentUser && data.name) {
      try {
        await updateProfile(auth.currentUser, { displayName: data.name });
      } catch (e) {
        console.error("Error updating firebase profile", e);
      }
    }

    const updatedUser = { ...user, ...data };
    setUser(updatedUser);
    saveUserDataToLocal(user.id, data);
    syncUserToMasterList(updatedUser);
    
    if (!auth || user.id.startsWith('master-admin')) {
        localStorage.setItem('nursy_mock_session', JSON.stringify(updatedUser));
    }
  };

  return (
    <AppContext.Provider value={{ 
        user, 
        isLoading, 
        courses,
        login, 
        loginWithGoogle, 
        loginWithPhoneMock, 
        signup, 
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