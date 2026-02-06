
import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext.tsx';
import { useAuth } from '../context/AuthContext.tsx';
import { COLORS } from '../constants.tsx';
import Input from './Input.tsx';
import OAuthButtons from './OAuthButtons.tsx';
import { Mail, Lock, UserPlus, Check, X } from 'lucide-react';

const SignUp: React.FC<{ onSwitch: () => void }> = ({ onSwitch }) => {
  const { theme } = useTheme();
  const { signUp } = useAuth();
  const colors = COLORS[theme];

  const [formData, setFormData] = useState({ 
    email: '', 
    password: '', 
    confirmPassword: '' 
  });
  
  const [errors, setErrors] = useState({
    password: '',
    confirm: ''
  });

  const [loading, setLoading] = useState(false);

  const validation = {
    length: formData.password.length >= 8,
    upper: /[A-Z]/.test(formData.password),
    lower: /[a-z]/.test(formData.password),
    digit: /[0-9]/.test(formData.password),
    symbol: /[^A-Za-z0-9]/.test(formData.password),
  };

  const isPasswordValid = Object.values(validation).every(v => v);

  useEffect(() => {
    if (formData.confirmPassword && formData.password !== formData.confirmPassword) {
      setErrors(prev => ({ ...prev, confirm: 'Passwords do not match' }));
    } else {
      setErrors(prev => ({ ...prev, confirm: '' }));
    }
  }, [formData.password, formData.confirmPassword]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isPasswordValid || errors.confirm || !formData.email) return;
    setLoading(true);
    await signUp(formData.email);
    setLoading(false);
  };

  const Requirement: React.FC<{ met: boolean; text: string }> = ({ met, text }) => (
    <div className={`flex items-center gap-1.5 text-[10px] font-medium transition-colors ${met ? 'text-green-500' : 'opacity-40'}`}>
      {met ? <Check size={12} /> : <X size={12} />}
      {text}
    </div>
  );

  return (
    <div className="w-full max-w-md p-8 rounded-[2.5rem] shadow-2xl space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500"
         style={{ backgroundColor: colors.card, border: theme === 'dark' ? '1px solid #333' : `1px solid ${colors.background}` }}>
      
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-black tracking-tight" style={{ color: colors.primary }}>Create Account</h1>
        <p className="text-sm opacity-60" style={{ color: colors.text }}>Join the PHD research community</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Email Address"
          type="email"
          placeholder="you@example.com"
          value={formData.email}
          onChange={e => setFormData({ ...formData, email: e.target.value })}
          icon={<Mail size={18} />}
          required
        />
        
        <div className="space-y-3">
          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={e => setFormData({ ...formData, password: e.target.value })}
            icon={<Lock size={18} />}
            required
          />
          
          <div className="grid grid-cols-2 gap-x-2 gap-y-1 px-1">
            <Requirement met={validation.length} text="8+ Characters" />
            <Requirement met={validation.upper} text="Uppercase" />
            <Requirement met={validation.lower} text="Lowercase" />
            <Requirement met={validation.digit} text="Digit" />
            <Requirement met={validation.symbol} text="Symbol" />
          </div>
        </div>

        <Input
          label="Confirm Password"
          type="password"
          placeholder="••••••••"
          value={formData.confirmPassword}
          onChange={e => setFormData({ ...formData, confirmPassword: e.target.value })}
          icon={<Lock size={18} />}
          error={errors.confirm}
          required
        />

        <button
          type="submit"
          disabled={loading || !isPasswordValid || !!errors.confirm}
          className="w-full py-4 rounded-xl font-black flex items-center justify-center gap-2 hover:opacity-90 active:scale-[0.98] transition-all shadow-lg disabled:opacity-40 disabled:cursor-not-allowed"
          style={{ backgroundColor: colors.primary, color: colors.card }}
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              Sign Up
              <UserPlus size={18} />
            </>
          )}
        </button>
      </form>

      <OAuthButtons />

      <p className="text-center text-sm opacity-60" style={{ color: colors.text }}>
        Already have an account?{' '}
        <button 
          onClick={onSwitch}
          className="font-black hover:underline"
          style={{ color: colors.accent }}
        >
          Sign In
        </button>
      </p>
    </div>
  );
};

export default SignUp;
