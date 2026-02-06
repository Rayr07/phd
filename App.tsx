
import React, { useState, useEffect, createContext, useContext } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import OpsPage from './pages/OpsPage';
import SavedPage from './pages/SavedPage';
import Layout from './components/Layout';
import { User } from './types';

interface ThemeContextType {
  isDark: boolean;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within ThemeProvider");
  return context;
};

const App: React.FC = () => {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved === 'dark';
  });
  const [user, setUser] = useState<User>(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : { email: '', isLoggedIn: false };
  });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  useEffect(() => {
    localStorage.setItem('user', JSON.stringify(user));
  }, [user]);

  const toggleTheme = () => setIsDark(!isDark);

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      <Router>
        <Routes>
          <Route path="/signin" element={user.isLoggedIn ? <Navigate to="/saved" /> : <SignIn setUser={setUser} />} />
          <Route path="/signup" element={user.isLoggedIn ? <Navigate to="/saved" /> : <SignUp setUser={setUser} />} />
          <Route path="/" element={user.isLoggedIn ? <Layout user={user} setUser={setUser}><SavedPage /></Layout> : <Navigate to="/signin" />} />
          <Route path="/saved" element={user.isLoggedIn ? <Layout user={user} setUser={setUser}><SavedPage /></Layout> : <Navigate to="/signin" />} />
          <Route path="/ops/:projectId" element={user.isLoggedIn ? <Layout user={user} setUser={setUser}><OpsPage /></Layout> : <Navigate to="/signin" />} />
        </Routes>
      </Router>
    </ThemeContext.Provider>
  );
};

export default App;
