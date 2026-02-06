
import React from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import { useTheme } from '../context/ThemeContext.tsx';
import { COLORS } from '../constants.tsx';
import { Shield, Settings, Activity, User } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { theme } = useTheme();
  const colors = COLORS[theme];

  const StatCard = ({ title, value, icon: Icon }: any) => (
    <div className="p-6 rounded-3xl border space-y-4" style={{ backgroundColor: colors.card, borderColor: theme === 'dark' ? '#333' : 'rgba(0,0,0,0.1)' }}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-widest opacity-50">{title}</span>
        <Icon size={18} className="opacity-50" />
      </div>
      <div className="text-2xl font-black">{value}</div>
    </div>
  );

  return (
    <div className="w-full max-w-5xl mx-auto p-6 space-y-8 animate-in zoom-in-95 duration-500">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-4xl font-black tracking-tight" style={{ color: colors.primary }}>Dashboard</h1>
          <p className="text-lg opacity-60">Welcome back, <span className="font-bold" style={{ color: colors.text }}>{user?.email}</span></p>
        </div>
        <div className="flex gap-2">
           <button className="px-4 py-2 rounded-xl text-sm font-bold border transition-all" style={{ borderColor: colors.primary, color: colors.primary }}>Export Data</button>
           <button className="px-4 py-2 rounded-xl text-sm font-bold shadow-lg transition-all" style={{ backgroundColor: colors.primary, color: theme === 'light' ? colors.background : colors.text }}>New Project</button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Account Security" value="Strong" icon={Shield} />
        <StatCard title="System Status" value="Healthy" icon={Activity} />
        <StatCard title="Active Sessions" value="1" icon={User} />
      </div>

      <div className="p-12 rounded-[2rem] text-center space-y-4 border" style={{ backgroundColor: colors.card, borderColor: theme === 'dark' ? '#333' : 'rgba(0,0,0,0.05)' }}>
        <div className="w-20 h-20 mx-auto rounded-3xl flex items-center justify-center opacity-20" style={{ backgroundColor: colors.primary }}>
          <Settings size={40} />
        </div>
        <h2 className="text-2xl font-bold">Secure Environment Active</h2>
        <p className="max-w-md mx-auto opacity-60">You are currently logged into the PHD secure portal. All actions are encrypted and logged for your protection.</p>
      </div>
    </div>
  );
};

export default Dashboard;
