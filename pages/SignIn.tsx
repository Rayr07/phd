
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User } from '../types';

interface SignInProps {
  setUser: (user: User) => void;
}

const SignIn: React.FC<SignInProps> = ({ setUser }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setUser({ email, isLoggedIn: true });
    navigate('/saved');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-lbg dark:bg-dbg px-4">
      <div className="max-w-md w-full bg-white dark:bg-black/40 p-10 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-black text-laccent dark:text-daccent mb-2 tracking-tighter">PHD</h1>
          <p className="text-lsecondary dark:text-dtext font-medium">Welcome back to your workspace</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-bold mb-2 text-ltext dark:text-dtext">Email Address</label>
            <input 
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg outline-none focus:ring-2 focus:ring-lsecondary dark:focus:ring-gray-600 text-ltext dark:text-dtext"
              placeholder="name@university.edu"
              required
            />
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <label className="block text-sm font-bold text-ltext dark:text-dtext">Password</label>
              <button type="button" className="text-xs text-lsecondary dark:text-dtext hover:underline font-bold">Forgot Password?</button>
            </div>
            <input 
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg outline-none focus:ring-2 focus:ring-lsecondary dark:focus:ring-gray-600 text-ltext dark:text-dtext"
              placeholder="••••••••"
              required
            />
          </div>

          <button 
            type="submit"
            className="w-full py-4 rounded-xl font-black text-white bg-lsecondary hover:brightness-110 dark:bg-gray-800 dark:text-dtext dark:border dark:border-gray-700 shadow-lg transition-all transform active:scale-95 uppercase tracking-widest"
          >
            Sign In
          </button>
        </form>

        <p className="text-center mt-8 text-sm text-gray-500 dark:text-dtext">
          New to PHD? <Link to="/signup" className="text-laccent dark:text-dtext font-black hover:underline">Create an account</Link>
        </p>
      </div>
    </div>
  );
};

export default SignIn;
