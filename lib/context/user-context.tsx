'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface UserProfile {
  age: string;
  gender: string;
  race: string;
  height: string;
  weight: string;
  location: string;
  recentIllness: string;
  currentConditions: string;
  allergies: string;
  medications: string;
  familyHistory: string;
  lifestyle: {
    smoking: string;
    alcohol: string;
    exercise: string;
  };
}

interface UserContextType {
  userProfile: UserProfile | null;
  setUserProfile: (profile: UserProfile) => void;
  saveUserProfile: (profile: UserProfile) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    // Load user profile from localStorage on mount
    const savedProfile = localStorage.getItem('userProfile');
    if (savedProfile) {
      setUserProfile(JSON.parse(savedProfile));
    }
  }, []);

  const saveUserProfile = (profile: UserProfile) => {
    setUserProfile(profile);
    localStorage.setItem('userProfile', JSON.stringify(profile));
  };

  return (
    <UserContext.Provider value={{ userProfile, setUserProfile, saveUserProfile }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
} 