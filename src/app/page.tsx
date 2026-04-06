import Image from 'next/image';
import Link from 'next/link';
import { SpeckleBackground } from '@/components/SpeckleBackground';

export default function Home() {
  return (
    <main className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background">
      {/* Dynamic Animated Background */}
      <SpeckleBackground />

      {/* Hero Content */}
      <div className="relative z-10 flex flex-col items-center justify-center p-8 text-center max-w-4xl mx-auto">
        <div className="space-y-6 backdrop-blur-md bg-card/40 dark:bg-card/20 p-12 rounded-3xl border border-white/20 dark:border-white/10 shadow-2xl transition-all duration-500 hover:shadow-primary/20">
          
          <div className="flex justify-center mb-6">
            <Image 
              src="/logo.svg" 
              alt="PHD Logo" 
              width={200} 
              height={200} 
              className="drop-shadow-lg object-contain"
              priority
            />
          </div>
          
          <p className="text-lg md:text-xl text-foreground/80 max-w-2xl mx-auto leading-relaxed mt-4">
            A secure, luxurious web application for researchers to manage projects, validate claims, and generate hypotheses using state-of-the-art AI.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-sm text-foreground/70 max-w-3xl mx-auto pt-4 pb-4">
            <div className="p-4 bg-card/30 rounded-xl border border-white/10 hover:bg-card/50 transition-colors">
              <strong className="block text-primary dark:text-accent mb-2">Contradiction Detection</strong>
              Log your sources and let the AI find conceptual clashes automatically.
            </div>
            <div className="p-4 bg-card/30 rounded-xl border border-white/10 hover:bg-card/50 transition-colors">
              <strong className="block text-primary dark:text-accent mb-2">Claim Validation</strong>
              Upload documents and verify if claims are strongly supported by underlying evidence.
            </div>
            <div className="p-4 bg-card/30 rounded-xl border border-white/10 hover:bg-card/50 transition-colors">
              <strong className="block text-primary dark:text-accent mb-2">Hypothesis Generation</strong>
              Let our AI act as a sounding board, proposing new research directions based on your data.
            </div>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
            <Link 
              href="/login" 
              className="w-full sm:w-auto px-8 py-4 bg-primary hover:bg-primary/90 text-white rounded-full font-medium transition-all duration-300 transform hover:scale-105 shadow-[0_0_20px_rgba(70,92,136,0.3)] dark:shadow-[0_0_20px_rgba(95,149,152,0.3)]"
            >
              Sign In
            </Link>
            <Link 
              href="/signup" 
              className="w-full sm:w-auto px-8 py-4 bg-card hover:bg-card/90 text-foreground border border-foreground/10 rounded-full font-medium transition-all duration-300 transform hover:scale-105 shadow-sm hover:shadow-md"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
