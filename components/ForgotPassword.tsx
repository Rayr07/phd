
import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext.tsx';
import { COLORS } from '../constants.tsx';
import Input from './Input.tsx';
import { Mail, ArrowLeft, Send } from 'lucide-react';

const ForgotPassword: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { theme } = useTheme();
  const colors = COLORS[theme];
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="w-full max-w-md p-8 rounded-3xl shadow-xl space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500"
         style={{ backgroundColor: colors.card, border: `1px solid ${theme === 'light' ? colors.accent : '#222'}` }}>
      
      <div className="flex items-center gap-2">
        <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-black/5 transition-colors">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-2xl font-bold tracking-tight" style={{ color: colors.text }}>Reset Password</h1>
      </div>

      {!sent ? (
        <>
          <p className="text-sm opacity-60" style={{ color: colors.text }}>
            Enter your email address and we'll send you a link to reset your password.
          </p>
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Email Address"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              icon={<Mail size={18} />}
              required
            />
            <button
              type="submit"
              className="w-full py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-all shadow-lg"
              style={{ backgroundColor: colors.primary, color: theme === 'light' ? colors.background : colors.text }}
            >
              Send Reset Link
              <Send size={18} />
            </button>
          </form>
        </>
      ) : (
        <div className="text-center py-6 space-y-4">
          <div className="w-16 h-16 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mx-auto">
            <Send size={32} />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-bold">Check your email</h2>
            <p className="text-sm opacity-60">We have sent a password recovery link to <b>{email}</b></p>
          </div>
          <button
            onClick={onBack}
            className="font-bold hover:underline text-sm"
            style={{ color: colors.primary }}
          >
            Back to Sign In
          </button>
        </div>
      )}
    </div>
  );
};

export default ForgotPassword;
