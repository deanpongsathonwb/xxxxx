import React, { createContext, useContext, useState, useEffect } from 'react';
import type { UserProfile } from '../types/common.types';
import seedUsers from '../seed/users.json';
import { STORAGE_KEYS } from '../constants/storage';

interface AuthContextType {
  currentUser: UserProfile | null;
  allUsers: UserProfile[];
  loginById: (id: string) => boolean;
  loginByUsername: (username: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const allUsers: UserProfile[] = seedUsers as UserProfile[];
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // Ignore storage read errors
    }
    return null;
  });

  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(currentUser));
      } else {
        localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
      }
    } catch {
      // Ignore storage write errors
    }
  }, [currentUser]);

  const loginById = (id: string): boolean => {
    const user = allUsers.find((u) => u.id === id);
    if (user) {
      setCurrentUser(user);
      return true;
    }
    return false;
  };

  const loginByUsername = (username: string): boolean => {
    const user = allUsers.find((u) => u.username.toLowerCase() === username.trim().toLowerCase());
    if (user) {
      setCurrentUser(user);
      return true;
    }
    return false;
  };

  const logout = (): void => {
    setCurrentUser(null);
  };

  return React.createElement(
    AuthContext.Provider,
    { value: { currentUser, allUsers, loginById, loginByUsername, logout } },
    children
  );
};

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
