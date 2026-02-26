'use client';

/**
 * Authentication hook for managing user state
 */

import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { getToken, removeToken, setToken } from './token';
import { getProfile } from '../api/auth';
import { DEMO_MODE } from '../api/demo-mode';
import type { User } from '@/types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Auth provider component
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const loadUser = async () => {
    // In demo mode, auto-login as demo brand user
    if (DEMO_MODE) {
      const demoToken = 'demo-token-brand-user';
      setToken(demoToken);
      try {
        const userData = await getProfile();
        setUser(userData);
      } catch (error) {
        console.error('Demo mode error:', error);
      } finally {
        setLoading(false);
      }
      return;
    }

    const token = getToken();
    
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const userData = await getProfile();
      setUser(userData);
    } catch (error) {
      // Token is invalid or expired
      removeToken();
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  const logout = () => {
    removeToken();
    setUser(null);
    window.location.href = '/login';
  };

  const refreshUser = async () => {
    await loadUser();
  };

  const value: AuthContextType = {
    user,
    loading,
    isAuthenticated: !!user,
    logout,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Hook to access authentication state
 */
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
}
