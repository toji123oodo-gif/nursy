import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, SubscriptionTier } from '../types';

interface AppContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, pass: string) => Promise<boolean>;
  signup: (data: Omit<User, 'id'>) => Promise<void>;
  logout: () => void;
  upgradeToPro: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check local storage for persistent session safely
    const storedUser = localStorage.getItem('nursy_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Failed to parse user data", error);
        localStorage.removeItem('nursy_user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, pass: string): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Hardcoded Test Users
        if (email === 'free@nursy.com' && pass === '123456') {
          const user: User = { 
            id: 'u_free', 
            name: 'طالب مجاني', 
            email, 
            phone: '01000000001', 
            subscriptionTier: 'free' 
          };
          setUser(user);
          localStorage.setItem('nursy_user', JSON.stringify(user));
          resolve(true);
        } else if (email === 'pro@nursy.com' && pass === '123456') {
          const user: User = { 
            id: 'u_pro', 
            name: 'طالب مشترك', 
            email, 
            phone: '01000000002', 
            subscriptionTier: 'pro' 
          };
          setUser(user);
          localStorage.setItem('nursy_user', JSON.stringify(user));
          resolve(true);
        } else {
          resolve(false);
        }
      }, 800); // Simulate network delay
    });
  };

  const signup = async (data: Omit<User, 'id'>) => {
    return new Promise<void>((resolve) => {
        setTimeout(() => {
            const newUser: User = { ...data, id: `u_${Date.now()}` };
            setUser(newUser);
            localStorage.setItem('nursy_user', JSON.stringify(newUser));
            resolve();
        }, 800);
    });
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('nursy_user');
    localStorage.removeItem('nursy_premium'); // Clear legacy flag if any
  };

  const upgradeToPro = () => {
    if (user) {
      const updatedUser = { ...user, subscriptionTier: 'pro' as SubscriptionTier };
      setUser(updatedUser);
      localStorage.setItem('nursy_user', JSON.stringify(updatedUser));
    }
  };

  return (
    <AppContext.Provider value={{ user, isLoading, login, signup, logout, upgradeToPro }}>
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