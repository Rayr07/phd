
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '../App';
import { User } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  user: User;
  setUser: (user: User) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, user, setUser }) => {
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSignOut = () => {
    setUser({ email: '', isLoggedIn: false });
    navigate('/signin');
  };

  return (
    <div className="min-h-screen bg-lbg text-ltext dark:bg-dbg dark:text-dtext">
      {/* Top Bar */}
      <header className="h-16 flex items-center justify-between px-6 border-b border-gray-300 dark:border-gray-800 bg-white/50 dark:bg-black/40 backdrop-blur-md fixed top-0 w-full z-50">
        <div 
          className="text-2xl font-bold cursor-pointer flex items-center gap-2"
          onClick={() => navigate('/saved')}
        >
          <span className="text-laccent dark:text-dtext font-black tracking-tighter text-3xl">PHD</span>
        </div>

        <div className="flex items-center gap-6">
          <button 
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
            title="Toggle Light/Dark Mode"
          >
            {isDark ? (
              <i className="fa-solid fa-sun text-yellow-400"></i>
            ) : (
              <i className="fa-solid fa-moon text-lsecondary"></i>
            )}
          </button>
          
          <div className="flex items-center gap-4 pl-4 border-l border-gray-300 dark:border-gray-700">
            <span className="hidden sm:inline-block text-sm font-bold opacity-70 dark:text-dtext">{user.email}</span>
            <button 
              onClick={handleSignOut}
              className="text-sm font-black uppercase tracking-widest hover:text-laccent dark:hover:text-white transition-colors dark:text-dtext"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="pt-16 min-h-screen">
        {children}
      </main>
    </div>
  );
};

export default Layout;
