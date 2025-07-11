import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@supabase/supabase-js';
import { AuthService } from '../services/authService';
import { supabase } from '../lib/supabase';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  isDemo: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, userData: any) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDemo, setIsDemo] = useState(false);

  useEffect(() => {
    // Check if Supabase is configured
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseKey) {
      setIsDemo(true);
      setLoading(false);
      return;
    }

    // Get initial session
    const getSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setUser(session?.user ?? null);
      } catch (error) {
        console.error('Error getting session:', error);
        setIsDemo(true);
      } finally {
        setLoading(false);
      }
    };

    getSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    if (isDemo) {
      // Demo mode login
      const demoUsers = {
        'donor@demo.com': { id: '1', email: 'donor@demo.com', role: 'donor' },
        'recipient@demo.com': { id: '2', email: 'recipient@demo.com', role: 'recipient' },
        'hospital@demo.com': { id: '3', email: 'hospital@demo.com', role: 'hospital' },
        'admin@demo.com': { id: '4', email: 'admin@demo.com', role: 'admin' }
      };

      const demoUser = demoUsers[email as keyof typeof demoUsers];
      if (demoUser) {
        setUser(demoUser as any);
        localStorage.setItem('demoUser', JSON.stringify(demoUser));
      } else {
        throw new Error('Invalid demo credentials');
      }
    } else {
      await AuthService.login(email, password);
    }
  };

  const register = async (email: string, password: string, userData: any) => {
    if (isDemo) {
      throw new Error('Registration not available in demo mode');
    } else {
      await AuthService.register(email, password, userData);
    }
  };

  const logout = async () => {
    if (isDemo) {
      setUser(null);
      localStorage.removeItem('demoUser');
    } else {
      await AuthService.logout();
    }
  };

  // Load demo user from localStorage on mount
  useEffect(() => {
    if (isDemo && !user) {
      const savedDemoUser = localStorage.getItem('demoUser');
      if (savedDemoUser) {
        setUser(JSON.parse(savedDemoUser));
      }
    }
  }, [isDemo, user]);

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    loading,
    isDemo,
    login,
    register,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};