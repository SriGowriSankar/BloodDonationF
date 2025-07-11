import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthState } from '../types';
import { AuthService } from '../services/authService';
import { supabase } from '../lib/supabase';

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
    // Check for existing session
    const checkSession = async () => {
      try {
        const user = await AuthService.getCurrentUser();
        if (user) {
          setState({
            user,
            isAuthenticated: true,
            loading: false,
          });
        } else {
          setState(prev => ({ ...prev, loading: false }));
        }
      } catch (error) {
        console.error('Session check error:', error);
        setState(prev => ({ ...prev, loading: false }));
      }
    };

    checkSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          const user = await AuthService.getCurrentUser();
          setState({
            user,
            isAuthenticated: true,
            loading: false,
          });
        } else if (event === 'SIGNED_OUT') {
          setState({
            user: null,
            isAuthenticated: false,
            loading: false,
          });
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    setState(prev => ({ ...prev, loading: true }));
    
    try {
      const { user } = await AuthService.signIn(email, password);
      setState({
        user,
        isAuthenticated: true,
        loading: false,
      });
    } catch (error) {
      setState(prev => ({ ...prev, loading: false }));
      throw error;
    }
  };

  const register = async (userData: Partial<User>) => {
    setState(prev => ({ ...prev, loading: true }));
    
    try {
      if (!userData.email || !userData.password) {
        throw new Error('Email and password are required');
      }

      const { user } = await AuthService.signUp(
        userData.email,
        userData.password,
        userData
      );

      setState({
        user,
        isAuthenticated: true,
        loading: false,
      });
    } catch (error) {
      setState(prev => ({ ...prev, loading: false }));
      throw error;
    }
  };

  const logout = () => {
    AuthService.signOut();
    setState({
      user: null,
      isAuthenticated: false,
      loading: false,
    });
  };

  const updateUser = (userData: Partial<User>) => {
    if (state.user) {
      AuthService.updateProfile(state.user.id, userData)
        .then(updatedUser => {
          setState(prev => ({ ...prev, user: updatedUser }));
        })
        .catch(error => {
          console.error('Update user error:', error);
        });
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