"use client";

import Link from "next/link";
import { useTheme } from "@/components/ThemeProvider";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

export function Header() {
  const { theme, toggleTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-background/80 backdrop-blur-md border-b border-zinc-200/50 dark:border-zinc-800/50 py-3 shadow-sm" : "bg-transparent py-5"}`}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-accent text-white flex items-center justify-center font-bold text-lg transform group-hover:scale-105 transition-transform">
            P
          </div>
          <span className="font-bold text-xl tracking-tight text-foreground">
            PHD Workspace
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-foreground/70">
          <a href="#how-it-works" className="hover:text-accent transition-colors">How it Works</a>
          <a href="#features" className="hover:text-accent transition-colors">Features</a>
          <a href="#dashboard" className="hover:text-accent transition-colors">Workspace</a>
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-foreground"
            aria-label="Toggle Dark Mode"
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          
          <Link 
            href="/login" 
            className="hidden sm:inline-flex px-5 py-2 text-sm font-semibold rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-foreground"
          >
            Log in
          </Link>
          <Link 
            href="/signup" 
            className="px-5 py-2 text-sm font-semibold rounded-full bg-accent hover:bg-[#e66a25] dark:bg-primary dark:hover:bg-[#4d7b7e] text-white transition-all transform hover:scale-105 shadow-[0_4px_14px_rgba(255,122,48,0.3)] dark:shadow-[0_4px_14px_rgba(95,149,152,0.3)]"
          >
            Get Started
          </Link>
        </div>
      </div>
    </header>
  );
}
