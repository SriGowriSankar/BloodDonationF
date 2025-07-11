import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthState } from '../types';

// Check if Supabase is configured
const isSupabaseConfigured = () => {
  return !!(import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY);
};

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (userData: Partial<User>) => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
  isDemo: boolean;
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
    isDemo: !isSupabaseConfigured(),
  });

  useEffect(() => {
    // Check for existing session
    const checkSession = async () => {
      try {
        if (isSupabaseConfigured()) {
          const { AuthService } = await import('../services/authService');
          const user = await AuthService.getCurrentUser();
          if (user) {
            setState(prev => ({
              ...prev,
              user,
              isAuthenticated: true,
              loading: false,
            }));
          } else {
            setState(prev => ({ ...prev, loading: false }));
          }
        } else {
          // Demo mode - no Supabase configuration
          setState(prev => ({ ...prev, loading: false }));
        }
      } catch (error) {
        console.error('Session check error:', error);
        setState(prev => ({ ...prev, loading: false, isDemo: true }));
      }
    };

    checkSession();

    // Listen for auth changes only if Supabase is configured
    let subscription: any = null;
    if (isSupabaseConfigured()) {
      import('../lib/supabase').then(({ supabase }) => {
        const { data } = supabase.auth.onAuthStateChange(
          async (event, session) => {
            if (event === 'SIGNED_IN' && session) {
              const { AuthService } = await import('../services/authService');
              const user = await AuthService.getCurrentUser();
              setState(prev => ({
                ...prev,
                user,
                isAuthenticated: true,
                loading: false,
              }));
            } else if (event === 'SIGNED_OUT') {
              setState(prev => ({
                ...prev,
                user: null,
                isAuthenticated: false,
                loading: false,
              }));
            }
          }
        );
        subscription = data.subscription;
      });
    }

    return () => {
      if (subscription) {
        subscription.unsubscribe();
        }
      }
    };
  }, []);

  // Demo login function
  const demoLogin = (email: string) => {
    const demoUsers = {
      'donor@demo.com': {
        id: 'demo-donor-1',
        name: 'John Donor',
        email: 'donor@demo.com',
        phone: '+1-555-0101',
        role: 'donor' as const,
        verified: true,
        createdAt: new Date().toISOString(),
        status: 'active' as const,
      },
      'recipient@demo.com': {
        id: 'demo-recipient-1',
        name: 'Jane Recipient',
        email: 'recipient@demo.com',
        phone: '+1-555-0102',
        role: 'recipient' as const,
        verified: true,
        createdAt: new Date().toISOString(),
        status: 'active' as const,
      },
      'hospital@demo.com': {
        id: 'demo-hospital-1',
        name: 'City General Hospital',
        email: 'hospital@demo.com',
        phone: '+1-555-0103',
        role: 'hospital' as const,
        verified: true,
        createdAt: new Date().toISOString(),
        status: 'active' as const,
      },
      'admin@demo.com': {
        id: 'demo-admin-1',
        name: 'System Admin',
        email: 'admin@demo.com',
        phone: '+1-555-0104',
        role: 'admin' as const,
        verified: true,
        createdAt: new Date().toISOString(),
        status: 'active' as const,
      },
    };

    const user = demoUsers[email as keyof typeof demoUsers];
    if (user) {
      setState(prev => ({
        ...prev,
        user,
        isAuthenticated: true,
        loading: false,
      }));
    } else {
      throw new Error('Invalid demo credentials');
    }
  };

  const login = async (email: string, password: string) => {
    setState(prev => ({ ...prev, loading: true }));
    
    try {
      if (isSupabaseConfigured()) {
        const { AuthService } = await import('../services/authService');
        const { user } = await AuthService.signIn(email, password);
        setState(prev => ({
          ...prev,
          user,
          isAuthenticated: true,
          loading: false,
        }));
      } else {
        // Demo mode
        demoLogin(email);
      }
    } catch (error) {
      setState(prev => ({ ...prev, loading: false }));
      throw error;
    }
  };

  const register = async (userData: Partial<User>) => {
    setState(prev => ({ ...prev, loading: true }));
    
    try {
      if (isSupabaseConfigured()) {
        if (!userData.email || !userData.password) {
          throw new Error('Email and password are required');
        }

        const { AuthService } = await import('../services/authService');
        const { user } = await AuthService.signUp(
          userData.email,
          userData.password,
          userData
        );

        setState(prev => ({
          ...prev,
          user,
          isAuthenticated: true,
          loading: false,
        }));
      } else {
        // Demo mode - simulate registration
        throw new Error('Demo mode: Registration not available. Use demo accounts.');
      }
    } catch (error) {
      setState(prev => ({ ...prev, loading: false }));
      throw error;
    }
  };

  const logout = () => {
    if (isSupabaseConfigured()) {
      import('../services/authService').then(({ AuthService }) => {
        AuthService.signOut();
      });
    }
    setState(prev => ({
      ...prev,
      user: null,
      isAuthenticated: false,
      loading: false,
    }));
  };

  const updateUser = (userData: Partial<User>) => {
    if (state.user && isSupabaseConfigured()) {
      import('../services/authService').then(({ AuthService }) => {
        AuthService.updateProfile(state.user!.id, userData)
          .then(updatedUser => {
            setState(prev => ({ ...prev, user: updatedUser }));
          })
          .catch(error => {
            console.error('Update user error:', error);
          });
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
        isDemo: state.isDemo,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};