import Link from "next/link";
import Image from "next/image";
import { ArrowRight, FileText, CheckCircle } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex flex-col items-center justify-center pt-32 pb-20 px-6 section-fade">
      <div className="max-w-4xl mx-auto text-center z-10 flex flex-col items-center">
        
        <div className="mb-6">
          <Image 
            src="/logo.svg" 
            alt="PHD Logo" 
            width={120} 
            height={120} 
            className="drop-shadow-lg object-contain transition-transform duration-500 hover:scale-105"
            priority
          />
        </div>

        <div className="inline-flex items-center gap-2 mb-8 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 text-accent font-semibold text-sm tracking-wide shadow-sm backdrop-blur-sm transform transition-transform hover:scale-105">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
          </span>
          Next-Gen Research Platform
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-foreground mb-8 leading-tight">
          Where Meticulous <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-[#ff9b66]">
            Research Happens
          </span>
        </h1>

        <p className="text-xl md:text-2xl text-foreground/70 leading-relaxed max-w-3xl mb-12 font-medium">
          Upload papers, instantly detect contradictions, validate claims against evidence, and synthesize novel hypotheses using advanced AI validation.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <Link 
            href="/signup" 
            className="w-full sm:w-auto group flex items-center justify-center gap-2 px-8 py-4 bg-accent hover:bg-[#e66a25] dark:bg-primary dark:hover:bg-[#4d7b7e] text-white rounded-full font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-[0_4px_20px_rgba(255,122,48,0.3)] dark:shadow-[0_4px_20px_rgba(95,149,152,0.3)]"
          >
            Start Analyzing
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <a 
            href="#how-it-works" 
            className="w-full sm:w-auto px-8 py-4 bg-background hover:bg-card border-2 border-accent/20 hover:border-accent/50 dark:border-primary/50 dark:hover:border-primary/80 text-foreground rounded-full font-semibold text-lg transition-all duration-300"
          >
            See How it Works
          </a>
        </div>

        <div className="mt-16 flex items-center justify-center gap-8 text-foreground/50 text-sm font-medium">
          <div className="flex items-center gap-2">
            <CheckCircle size={16} className="text-accent" />
            <span>Secure Storage</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle size={16} className="text-accent" />
            <span>AI-Powered RAG</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle size={16} className="text-accent" />
            <span>Instant Insights</span>
          </div>
        </div>
        
      </div>
    </section>
  );
}
