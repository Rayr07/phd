'use client'

import { useState } from 'react'
import { signup } from '@/app/actions/auth'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Mail, Lock, User, Loader2, ShieldCheck } from 'lucide-react'
import { useTheme } from '@/components/ThemeProvider'

export default function SignupPage() {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const { theme } = useTheme()
  
  // Real-time password validation logic for UI feedback
  const [password, setPassword] = useState('')

  const validations = {
    length: password.length >= 8,
    upper: /[A-Z]/.test(password),
    lower: /[a-z]/.test(password),
    special: /[\W_]/.test(password),
    sequential: !/(?:(?:0(?=1)|1(?=2)|2(?=3)|3(?=4)|4(?=5)|5(?=6)|6(?=7)|7(?=8)|8(?=9))|(?:\d(?=\d)))(?:(?:1(?=2)|2(?=3)|3(?=4)|4(?=5)|5(?=6)|6(?=7)|7(?=8)|8(?=9))|(?:\d(?=\d)))(?:\d)/.test(password) // Complex logic handled mostly on server, but simple visual cue here. For simplicity let's just assume valid visually unless typed.
  }
  
  const hasSequentialDigits = (pass: string) => {
    for (let i = 0; i < pass.length - 2; i++) {
      const char1 = parseInt(pass[i]);
      const char2 = parseInt(pass[i+1]);
      const char3 = parseInt(pass[i+2]);
      if (!isNaN(char1) && !isNaN(char2) && !isNaN(char3)) {
        if (char2 === char1 + 1 && char3 === char2 + 1) return true;
        if (char2 === char1 - 1 && char3 === char2 - 1) return true;
      }
    }
    return false;
  }
  validations.sequential = !hasSequentialDigits(password);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const formData = new FormData(e.currentTarget)
    const res = await signup(formData)
    if (res?.error) {
      setError(res.error)
      setLoading(false)
    }
  }

  return (
    <main className="flex-1 flex items-center justify-center p-4 bg-background min-h-screen relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[100px] -z-10" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, type: 'spring' }}
        className="w-full max-w-md my-8"
      >
        <div className="bg-card/80 backdrop-blur-xl p-8 rounded-2xl shadow-2xl border border-card">
          <div className="flex flex-col items-center mb-8">
            <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center mb-4 text-white shadow-lg shadow-primary/30">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">Create Account</h1>
            <p className="text-foreground/60 text-sm mt-2">Join the researcher network</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-sm flex items-center"
              >
                {error}
              </motion.div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground/80">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/40" />
                <input 
                  type="text" name="name" required
                  className="w-full bg-input/50 border border-card pl-10 pr-4 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground"
                  placeholder="Dr. Jane Doe"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground/80">Email address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/40" />
                <input 
                  type="email" name="email" required
                  className="w-full bg-input/50 border border-card pl-10 pr-4 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground"
                  placeholder="name@example.com"
                />
              </div>
            </div>

            <div className="flex gap-4">
              <div className="space-y-2 flex-1">
                <label className="text-sm font-medium text-foreground/80">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/40" />
                  <input 
                    type="password" name="password" required
                    value={password} onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-input/50 border border-card pl-10 pr-4 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div className="space-y-2 flex-1">
                <label className="text-sm font-medium text-foreground/80">Confirm</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/40" />
                  <input 
                    type="password" name="confirmPassword" required
                    className="w-full bg-input/50 border border-card pl-10 pr-4 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            </div>

            <div className="text-xs text-foreground/60 space-y-1 mt-2 p-3 bg-input/30 rounded-lg">
              <p className={validations.length ? 'text-primary' : ''}>• Min 8 characters</p>
              <p className={validations.upper && validations.lower ? 'text-primary' : ''}>• Uppercase & lowercase letters</p>
              <p className={validations.special ? 'text-primary' : ''}>• At least 1 special character</p>
              <p className={validations.sequential ? 'text-primary' : 'text-red-500'}>• No sequential digits (e.g., 1234)</p>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className={`w-full font-medium py-2.5 rounded-xl transition-all shadow-lg flex items-center justify-center disabled:opacity-70 mt-4 ${
                theme === 'dark' 
                  ? 'bg-[#5f9598] hover:bg-[#4a7a7c] text-white shadow-[#5f9598]/20' 
                  : 'bg-[#ff7a30] hover:bg-[#e66526] text-white shadow-[#ff7a30]/20'
              }`}
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Create Account'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-foreground/60">
            Already have an account?{' '}
            <Link href="/login" className="text-primary hover:text-primary/80 font-medium transition-colors">
              Sign In
            </Link>
          </p>
        </div>
      </motion.div>
    </main>
  )
}
