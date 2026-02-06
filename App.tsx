
import React, { useState } from 'react';
import { ThemeProvider, useTheme } from './context/ThemeContext.tsx';
import { AuthProvider, useAuth } from './context/AuthContext.tsx';
import { COLORS } from './constants.tsx';
import Navbar from './components/Navbar.tsx';
import SignIn from './components/SignIn.tsx';
import SignUp from './components/SignUp.tsx';
import ForgotPassword from './components/ForgotPassword.tsx';
import Dashboard from './components/Dashboard.tsx';
import OpsPage from './components/OpsPage.tsx';
import { LayoutDashboard, Beaker } from 'lucide-react';

const AppContent: React.FC = () => {
  const { theme } = useTheme();
  const { isAuthenticated, isLoading } = useAuth();
  const [view, setView] = useState<'signin' | 'signup' | 'forgot'>('signin');
  const [activeTab, setActiveTab] = useState<'dashboard' | 'ops'>('ops');
  const colors = COLORS[theme];

  if (isLoading) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center transition-colors duration-500"
        style={{ backgroundColor: colors.background, color: colors.text }}
      >
        <div className="w-12 h-12 border-4 border-current border-t-transparent rounded-full animate-spin opacity-20" />
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen flex flex-col transition-colors duration-500 overflow-x-hidden"
      style={{ backgroundColor: colors.background, color: colors.text }}
    >
      <Navbar />
      
      {isAuthenticated && (
        <div className="w-full max-w-6xl mx-auto px-6 mt-4">
          <div className="flex gap-1 p-1 rounded-2xl bg-black/5 dark:bg-white/5 w-fit">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 ${activeTab === 'dashboard' ? 'shadow-sm' : 'opacity-40'}`}
              style={{ backgroundColor: activeTab === 'dashboard' ? colors.card : 'transparent' }}
            >
              <LayoutDashboard size={14} />
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab('ops')}
              className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 ${activeTab === 'ops' ? 'shadow-sm' : 'opacity-40'}`}
              style={{ backgroundColor: activeTab === 'ops' ? colors.card : 'transparent' }}
            >
              <Beaker size={14} />
              Ops Page
            </button>
          </div>
        </div>
      )}

      <main className="flex-grow flex items-start justify-center pt-8 pb-12">
        {!isAuthenticated ? (
          <div className="w-full flex justify-center items-center h-full">
            {view === 'signin' && (
              <SignIn 
                onSwitch={() => setView('signup')} 
                onForgot={() => setView('forgot')}
              />
            )}
            {view === 'signup' && (
              <SignUp onSwitch={() => setView('signin')} />
            )}
            {view === 'forgot' && (
              <ForgotPassword onBack={() => setView('signin')} />
            )}
          </div>
        ) : (
          <>
            {activeTab === 'dashboard' ? <Dashboard /> : <OpsPage />}
          </>
        )}
      </main>

      <footer className="py-6 px-6 text-center opacity-30 text-[10px] font-black tracking-[0.3em] uppercase">
        &copy; {new Date().getFullYear()} PHD SECURE SYSTEMS &bull; RESEARCH ARCHITECTURE
      </footer>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
