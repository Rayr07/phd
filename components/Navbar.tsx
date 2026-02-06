
import React from 'react';
import { useTheme } from '../context/ThemeContext.tsx';
import { COLORS } from '../constants.tsx';
import { Sun, Moon, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext.tsx';

const Navbar: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { isAuthenticated, signOut } = useAuth();
  const colors = COLORS[theme];

  return (
    <nav 
      className="sticky top-0 z-50 w-full px-6 py-4 flex items-center justify-between shadow-sm border-b transition-colors duration-300"
      style={{ 
        backgroundColor: colors.background,
        borderColor: theme === 'light' ? `${colors.primary}20` : '#222',
        color: colors.text 
      }}
    >
      <div className="flex items-center gap-2">
        <span 
          className="text-2xl font-black tracking-tighter"
          style={{ color: colors.primary }}
        >
          PHD
        </span>
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full transition-all hover:scale-110 active:scale-95"
          style={{ backgroundColor: theme === 'light' ? '#00000010' : '#ffffff10' }}
          title="Toggle Theme"
        >
          {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
        </button>

        {isAuthenticated && (
          <button
            onClick={signOut}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all hover:opacity-90 active:scale-95"
            style={{ backgroundColor: colors.primary, color: colors.card }}
          >
            <LogOut size={16} />
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
