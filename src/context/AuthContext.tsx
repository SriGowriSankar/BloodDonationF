import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';

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
  const [loading, setLoading] = useState(false);
  const isDemo = true; // Always demo mode

  useEffect(() => {
    // Check for saved demo user
    const savedDemoUser = localStorage.getItem('demoUser');
    if (savedDemoUser) {
      setUser(JSON.parse(savedDemoUser));
    }
  }, []);

  const login = async (email: string, password: string) => {
    // Demo mode login
    const demoUsers = {
      'donor@demo.com': { id: '1', email: 'donor@demo.com', name: 'John Donor', phone: '+1234567890', role: 'donor', verified: true, createdAt: new Date().toISOString() },
      'recipient@demo.com': { id: '2', email: 'recipient@demo.com', name: 'Jane Recipient', phone: '+1234567891', role: 'recipient', verified: true, createdAt: new Date().toISOString() },
      'hospital@demo.com': { id: '3', email: 'hospital@demo.com', name: 'City Hospital', phone: '+1234567892', role: 'hospital', verified: true, createdAt: new Date().toISOString() },
      'admin@demo.com': { id: '4', email: 'admin@demo.com', name: 'Admin User', phone: '+1234567893', role: 'admin', verified: true, createdAt: new Date().toISOString() }
    };

    const demoUser = demoUsers[email as keyof typeof demoUsers];
    if (demoUser) {
      setUser(demoUser as User);
      localStorage.setItem('demoUser', JSON.stringify(demoUser));
    } else {
      throw new Error('Invalid demo credentials');
    }
  };

  const register = async (email: string, password: string, userData: any) => {
    throw new Error('Registration not available in demo mode');
  };

  const logout = async () => {
    setUser(null);
    localStorage.removeItem('demoUser');
  };

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