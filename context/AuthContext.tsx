
import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthState, User } from '../types';

interface AuthContextType extends AuthState {
  signIn: (email: string) => Promise<void>;
  signUp: (email: string) => Promise<void>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  useEffect(() => {
    // Simulate check for existing session
    const savedUser = localStorage.getItem('phd-user');
    if (savedUser) {
      setState({
        user: JSON.parse(savedUser),
        isAuthenticated: true,
        isLoading: false,
      });
    } else {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, []);

  const signIn = async (email: string) => {
    // Mocking auth delay
    await new Promise(res => setTimeout(res, 800));
    const user = { email };
    localStorage.setItem('phd-user', JSON.stringify(user));
    setState({ user, isAuthenticated: true, isLoading: false });
  };

  const signUp = async (email: string) => {
    await new Promise(res => setTimeout(res, 1000));
    const user = { email };
    localStorage.setItem('phd-user', JSON.stringify(user));
    setState({ user, isAuthenticated: true, isLoading: false });
  };

  const signOut = () => {
    localStorage.removeItem('phd-user');
    setState({ user: null, isAuthenticated: false, isLoading: false });
  };

  return (
    <AuthContext.Provider value={{ ...state, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
