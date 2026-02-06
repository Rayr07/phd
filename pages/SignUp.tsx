
import React, { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User } from '../types';

interface SignUpProps {
  setUser: (user: User) => void;
}

const SignUp: React.FC<SignUpProps> = ({ setUser }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

  const validation = useMemo(() => {
    const hasLength = password.length >= 8;
    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasDigit = /\d/.test(password);
    const hasSymbol = /[^A-Za-z0-9]/.test(password); 
    const match = password === confirmPassword && password.length > 0;
    const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    return { hasLength, hasUpper, hasLower, hasDigit, hasSymbol, match, emailValid };
  }, [email, password, confirmPassword]);

  const isValid = Object.values(validation).every(v => v);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isValid) {
      setUser({ email, isLoggedIn: true });
      navigate('/saved');
    }
  };

  const OAuthButton: React.FC<{ provider: string; icon: string }> = ({ provider, icon }) => (
    <button 
      type="button"
      className="w-full flex items-center justify-center gap-3 py-3 px-4 border border-lsecondary/20 dark:border-gray-700 rounded-lg hover:bg-lsecondary/5 dark:hover:bg-gray-800 transition-all font-bold mb-3 text-lsecondary dark:text-dtext"
    >
      <i className={`fa-brands ${icon}`}></i>
      Continue with {provider}
    </button>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-lbg dark:bg-dbg px-4 py-12">
      <div className="max-w-md w-full bg-white dark:bg-black/40 p-10 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-black text-laccent dark:text-dtext mb-2 tracking-tighter">PHD</h1>
          <p className="text-lsecondary dark:text-dtext font-bold uppercase text-xs tracking-widest opacity-80">Join the research revolution</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 text-ltext dark:text-dtext">
          <div>
            <label className="block text-sm font-bold mb-2">Email Address</label>
            <input 
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-lsecondary dark:focus:ring-gray-600 outline-none transition-all text-ltext dark:text-dtext"
              placeholder="name@university.edu"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-bold mb-2">Password</label>
            <input 
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-lsecondary dark:focus:ring-gray-600 outline-none transition-all text-ltext dark:text-dtext"
              placeholder="••••••••"
              required
            />
            <div className="mt-3 grid grid-cols-2 gap-2 text-[10px] sm:text-xs">
              <p className={validation.hasLength ? 'text-green-600 font-bold' : 'text-gray-400 dark:text-gray-600'}>✓ 8+ Characters</p>
              <p className={validation.hasUpper ? 'text-green-600 font-bold' : 'text-gray-400 dark:text-gray-600'}>✓ Uppercase</p>
              <p className={validation.hasLower ? 'text-green-600 font-bold' : 'text-gray-400 dark:text-gray-600'}>✓ Lowercase</p>
              <p className={validation.hasDigit ? 'text-green-600 font-bold' : 'text-gray-400 dark:text-gray-600'}>✓ One Digit</p>
              <p className={validation.hasSymbol ? 'text-green-600 font-bold' : 'text-gray-400 dark:text-gray-600'}>✓ One Symbol</p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold mb-2">Confirm Password</label>
            <input 
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={`w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border rounded-lg focus:ring-2 focus:ring-lsecondary dark:focus:ring-gray-600 outline-none transition-all text-ltext dark:text-dtext ${confirmPassword && !validation.match ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'}`}
              placeholder="••••••••"
              required
            />
            {confirmPassword && !validation.match && (
              <p className="text-red-600 text-xs font-bold mt-1">Passwords do not match</p>
            )}
          </div>

          <button 
            disabled={!isValid}
            className={`w-full py-4 rounded-xl font-black text-white transition-all transform active:scale-95 shadow-lg uppercase tracking-widest ${isValid ? 'bg-lsecondary hover:brightness-110 dark:bg-gray-800 dark:text-dtext' : 'bg-gray-200 dark:bg-gray-900 cursor-not-allowed text-gray-500'}`}
          >
            Create Free Account
          </button>
        </form>

        <div className="relative my-10">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-gray-200 dark:border-gray-800"></span>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white dark:bg-dbg text-gray-500 dark:text-dtext font-bold uppercase tracking-tighter">Or connect via</span>
          </div>
        </div>

        <OAuthButton provider="Google" icon="fa-google" />
        <OAuthButton provider="GitHub" icon="fa-github" />

        <p className="text-center mt-8 text-sm text-gray-500 dark:text-dtext font-medium">
          Already have an account? <Link to="/signin" className="text-laccent dark:text-dtext font-black hover:underline">Sign In</Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
