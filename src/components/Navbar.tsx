'use client'

import { useTheme } from './ThemeProvider'
import { Sun, Moon, LogOut, User as UserIcon } from 'lucide-react'
import { logout } from '@/app/actions/auth'
import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'

export function Navbar() {
  const { theme, toggleTheme } = useTheme()
  const [username, setUsername] = useState('Loading...')
  const supabase = createClient()

  useEffect(() => {
    async function loadUser() {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setUsername(user.user_metadata?.name || user.email?.split('@')[0] || 'Researcher')
      } else {
        setUsername('Guest')
      }
    }
    loadUser()
  }, [])

  return (
    <nav className="sticky top-0 z-50 w-full backdrop-blur-md bg-background/80 border-b border-card transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        <div className="flex items-center gap-2">
          <span className={`font-semibold text-lg tracking-tight hidden sm:block transition duration-200 ease-out hover:opacity-90 ${
            theme === 'dark' ? 'text-[#5f9598]' : 'text-[#ff7a30]'
          }`}>
            PHD Platform
          </span>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm font-medium text-foreground/80 bg-input/40 px-3 py-1.5 rounded-full border border-card">
            <UserIcon className="w-4 h-4 text-primary" />
            {username}
          </div>

          <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-card text-foreground/70 hover:text-primary transition-colors"
            title="Toggle theme"
          >
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          <form action={logout}>
            <button
              type="submit"
              className="p-2 rounded-full hover:bg-red-500/10 text-foreground/70 hover:text-red-500 transition-colors"
              title="Sign out"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </form>
        </div>
      </div>
    </nav>
  )
}

