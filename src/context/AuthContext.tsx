import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthState } from '../types';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (userData: Partial<User>) => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    loading: true,
  });

  useEffect(() => {
    // Check for stored user data
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setState({
        user,
        isAuthenticated: true,
        loading: false,
      });
    } else {
      setState(prev => ({ ...prev, loading: false }));
    }
  }, []);

  const login = async (email: string, password: string) => {
    setState(prev => ({ ...prev, loading: true }));
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock user data based on email
    const mockUser: User = {
      id: '1',
      name: email.includes('donor') ? 'John Donor' : 
            email.includes('hospital') ? 'City Hospital' : 
            email.includes('admin') ? 'Admin User' : 'Jane Recipient',
      email,
      phone: '+1234567890',
      role: email.includes('donor') ? 'donor' : 
            email.includes('hospital') ? 'hospital' : 
            email.includes('admin') ? 'admin' : 'recipient',
      verified: true,
      createdAt: new Date().toISOString(),
    };

    localStorage.setItem('user', JSON.stringify(mockUser));
    setState({
      user: mockUser,
      isAuthenticated: true,
      loading: false,
    });
  };

  const register = async (userData: Partial<User>) => {
    setState(prev => ({ ...prev, loading: true }));
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newUser: User = {
      id: Date.now().toString(),
      name: userData.name || '',
      email: userData.email || '',
      phone: userData.phone || '',
      role: userData.role || 'donor',
      verified: false,
      createdAt: new Date().toISOString(),
    };

    localStorage.setItem('user', JSON.stringify(newUser));
    setState({
      user: newUser,
      isAuthenticated: true,
      loading: false,
    });
  };

  const logout = () => {
    localStorage.removeItem('user');
    setState({
      user: null,
      isAuthenticated: false,
      loading: false,
    });
  };

  const updateUser = (userData: Partial<User>) => {
    if (state.user) {
      const updatedUser = { ...state.user, ...userData };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setState(prev => ({ ...prev, user: updatedUser }));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        register,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};