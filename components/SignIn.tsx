
import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext.tsx';
import { useAuth } from '../context/AuthContext.tsx';
import { COLORS } from '../constants.tsx';
import Input from './Input.tsx';
import OAuthButtons from './OAuthButtons.tsx';
import { Mail, Lock, ArrowRight } from 'lucide-react';

const SignIn: React.FC<{ onSwitch: () => void; onForgot: () => void }> = ({ onSwitch, onForgot }) => {
  const { theme } = useTheme();
  const { signIn } = useAuth();
  const colors = COLORS[theme];

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.password) return;
    setLoading(true);
    await signIn(formData.email);
    setLoading(false);
  };

  return (
    <div className="w-full max-w-md p-8 rounded-[2rem] shadow-2xl space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500"
         style={{ backgroundColor: colors.card, border: theme === 'dark' ? '1px solid #333' : `1px solid ${colors.background}` }}>
      
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-black tracking-tight" style={{ color: colors.primary }}>Welcome Back</h1>
        <p className="text-sm opacity-60" style={{ color: colors.text }}>Please enter your details to sign in</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <Input
          label="Email Address"
          type="email"
          placeholder="you@example.com"
          value={formData.email}
          onChange={e => setFormData({ ...formData, email: e.target.value })}
          icon={<Mail size={18} />}
          required
        />
        
        <div className="space-y-1">
          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={e => setFormData({ ...formData, password: e.target.value })}
            icon={<Lock size={18} />}
            required
          />
          <div className="flex justify-end">
            <button 
              type="button"
              onClick={onForgot}
              className="text-xs font-bold hover:underline"
              style={{ color: colors.accent }}
            >
              Forgot Password?
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 rounded-xl font-black flex items-center justify-center gap-2 hover:opacity-90 active:scale-[0.98] transition-all shadow-lg shadow-black/10"
          style={{ backgroundColor: colors.primary, color: colors.card }}
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              Sign In
              <ArrowRight size={18} />
            </>
          )}
        </button>
      </form>

      <OAuthButtons />

      <p className="text-center text-sm opacity-60" style={{ color: colors.text }}>
        Don't have an account?{' '}
        <button 
          onClick={onSwitch}
          className="font-black hover:underline"
          style={{ color: colors.accent }}
        >
          Sign Up
        </button>
      </p>
    </div>
  );
};

export default SignIn;
