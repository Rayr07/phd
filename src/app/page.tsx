import Image from 'next/image';
import Link from 'next/link';
import { SpeckleBackground } from '@/components/SpeckleBackground';

export default function Home() {
  return (
    <div className="bg-white text-zinc-900 min-h-screen font-sans selection:bg-[#ff7a30] selection:text-white relative">
      
      {/* Global Animated Speckles */}
      <SpeckleBackground />

      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-zinc-200">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="font-bold text-xl tracking-tight text-[#ff7a30]">PHD</div>
          <div className="flex gap-8 text-sm font-medium text-zinc-600">
            <a href="#home" className="hover:text-[#ff7a30] transition-colors">Home</a>
            <a href="#description" className="hover:text-[#ff7a30] transition-colors">Description</a>
            <a href="#features" className="hover:text-[#ff7a30] transition-colors">Features</a>
          </div>
        </div>
      </nav>

      {/* Container for smooth scrolling */}
      <main className="scroll-smooth relative z-10">
        
        {/* Home Section */}
        <section id="home" className="min-h-screen flex flex-col items-center justify-center pt-20 px-6">
          <div className="flex flex-col items-center text-center animate-in fade-in slide-in-from-bottom-8 duration-700 bg-white/40 backdrop-blur-sm p-12 rounded-3xl border border-white/20 shadow-xl">
            <div className="mb-4">
              <Image 
                src="/logo.svg" 
                alt="PHD Logo" 
                width={240} 
                height={240} 
                className="drop-shadow-lg object-contain transition-transform duration-500 hover:scale-105"
                priority
              />
            </div>
            
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-[#ff7a30] drop-shadow-sm mb-12">
              PHD
            </h1>

            <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 w-full sm:w-auto">
              <Link 
                href="/login" 
                className="w-full sm:w-auto px-10 py-4 bg-[#ff7a30] hover:bg-[#e66a25] text-white rounded-full font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-[0_4px_20px_rgba(255,122,48,0.3)]"
              >
                Sign In
              </Link>
              <Link 
                href="/signup" 
                className="w-full sm:w-auto px-10 py-4 bg-white/80 hover:bg-white text-[#ff7a30] border-2 border-[#ff7a30] rounded-full font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-sm"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </section>

        {/* Description Section */}
        <section id="description" className="min-h-[80vh] flex items-center justify-center bg-zinc-50/70 backdrop-blur-sm py-24 px-6 border-y border-zinc-100/50">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-block mb-4 px-4 py-1.5 rounded-full bg-orange-100/80 text-[#ff7a30] font-semibold text-sm tracking-wide uppercase shadow-sm">
              The Mission
            </div>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-zinc-900 mb-8 leading-tight drop-shadow-sm">
              An ecosystem designed for meticulous research and discovery.
            </h2>
            <p className="text-xl md:text-2xl text-zinc-700 leading-relaxed max-w-3xl mx-auto font-medium">
              PHD is a secure, luxurious web application tailored for researchers who demand precision. It bridges the gap between managing complex projects and leveraging state-of-the-art AI to validate claims, detect conceptual clashes, and synthesize novel hypotheses.
            </p>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-24 px-6 min-h-screen relative z-10 w-full relative">
          <div className="max-w-5xl mx-auto relative z-10">
            <div className="text-center mb-20 bg-white/30 p-8 rounded-3xl inline-block w-full backdrop-blur-sm shadow-sm border border-white/20">
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-zinc-900 mb-4">Core Capabilities</h2>
              <p className="text-xl text-zinc-600 font-medium">Everything you need to orchestrate and validate your research.</p>
            </div>

            <div className="space-y-12">
              {/* Feature 1 */}
              <div className="flex flex-col md:flex-row gap-8 p-8 rounded-3xl bg-white/40 backdrop-blur-sm border border-white/50 hover:bg-white/60 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="flex-shrink-0 flex items-center justify-center w-16 h-16 rounded-2xl bg-orange-100 text-[#ff7a30] text-2xl font-bold shadow-inner">
                  01
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-zinc-900 mb-3">Workspace Management</h3>
                  <p className="text-lg text-zinc-700 leading-relaxed font-medium">
                    Organize your files, papers, and sources in a pristine, dedicated environment. Navigate through your projects with unparalleled speed and organization, keeping your research structured and accessible.
                  </p>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="flex flex-col md:flex-row gap-8 p-8 rounded-3xl bg-white/40 backdrop-blur-sm border border-white/50 hover:bg-white/60 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="flex-shrink-0 flex items-center justify-center w-16 h-16 rounded-2xl bg-orange-100 text-[#ff7a30] text-2xl font-bold shadow-inner">
                  02
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-zinc-900 mb-3">Contradiction Detection</h3>
                  <p className="text-lg text-zinc-700 leading-relaxed font-medium">
                    Log your vast array of sources and allow our advanced AI to automatically scan and identify conceptual clashes or conflicting data points across thousands of pages instantly.
                  </p>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="flex flex-col md:flex-row gap-8 p-8 rounded-3xl bg-white/40 backdrop-blur-sm border border-white/50 hover:bg-white/60 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="flex-shrink-0 flex items-center justify-center w-16 h-16 rounded-2xl bg-orange-100 text-[#ff7a30] text-2xl font-bold shadow-inner">
                  03
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-zinc-900 mb-3">Claim Validation</h3>
                  <p className="text-lg text-zinc-700 leading-relaxed font-medium">
                    Upload new documentation and run rigorous checks to verify whether external claims are genuinely and strongly supported by your underlying ground-truth evidence.
                  </p>
                </div>
              </div>

              {/* Feature 4 */}
              <div className="flex flex-col md:flex-row gap-8 p-8 rounded-3xl bg-white/40 backdrop-blur-sm border border-white/50 hover:bg-white/60 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="flex-shrink-0 flex items-center justify-center w-16 h-16 rounded-2xl bg-orange-100 text-[#ff7a30] text-2xl font-bold shadow-inner">
                  04
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-zinc-900 mb-3">Hypothesis Generation</h3>
                  <p className="text-lg text-zinc-700 leading-relaxed font-medium">
                    Turn the AI into an active sounding board. By synthesizing logged data, it can proactively propose novel research directions, missing links, and unexplored hypotheses.
                  </p>
                </div>
              </div>
            </div>
            
          </div>
        </section>

        {/* Simple Footer */}
        <footer className="py-8 text-center text-zinc-600 bg-white/60 backdrop-blur-md border-t border-zinc-200 text-sm font-medium">
          <p>© {new Date().getFullYear()} PHD Workspace. All rights reserved.</p>
        </footer>

      </main>
    </div>
  );
}
