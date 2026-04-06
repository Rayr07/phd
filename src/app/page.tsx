import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="bg-white text-zinc-900 min-h-screen font-sans selection:bg-[#ff7a30] selection:text-white">
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
      <main className="scroll-smooth">
        
        {/* Home Section */}
        <section id="home" className="min-h-screen flex flex-col items-center justify-center pt-20 px-6">
          <div className="flex flex-col items-center text-center animate-in fade-in slide-in-from-bottom-8 duration-700">
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
                className="w-full sm:w-auto px-10 py-4 bg-white hover:bg-zinc-50 text-[#ff7a30] border-2 border-[#ff7a30] rounded-full font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-sm"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </section>

        {/* Description Section */}
        <section id="description" className="min-h-[80vh] flex items-center justify-center bg-zinc-50 py-24 px-6 border-y border-zinc-100">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-block mb-4 px-4 py-1.5 rounded-full bg-orange-100 text-[#ff7a30] font-semibold text-sm tracking-wide uppercase">
              The Mission
            </div>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-zinc-900 mb-8 leading-tight">
              An ecosystem designed for meticulous research and discovery.
            </h2>
            <p className="text-xl md:text-2xl text-zinc-600 leading-relaxed max-w-3xl mx-auto">
              PHD is a secure, luxurious web application tailored for researchers who demand precision. It bridges the gap between managing complex projects and leveraging state-of-the-art AI to validate claims, detect conceptual clashes, and synthesize novel hypotheses.
            </p>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-24 px-6 bg-white min-h-screen">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-zinc-900 mb-4">Core Capabilities</h2>
              <p className="text-xl text-zinc-500">Everything you need to orchestrate and validate your research.</p>
            </div>

            <div className="space-y-12">
              {/* Feature 1 */}
              <div className="flex flex-col md:flex-row gap-8 p-8 rounded-3xl bg-zinc-50 border border-zinc-100 hover:shadow-lg transition-shadow duration-300">
                <div className="flex-shrink-0 flex items-center justify-center w-16 h-16 rounded-2xl bg-orange-100 text-[#ff7a30] text-2xl font-bold">
                  01
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-zinc-900 mb-3">Workspace Management</h3>
                  <p className="text-lg text-zinc-600 leading-relaxed">
                    Organize your files, papers, and sources in a pristine, dedicated environment. Navigate through your projects with unparalleled speed and organization, keeping your research structured and accessible.
                  </p>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="flex flex-col md:flex-row gap-8 p-8 rounded-3xl bg-zinc-50 border border-zinc-100 hover:shadow-lg transition-shadow duration-300">
                <div className="flex-shrink-0 flex items-center justify-center w-16 h-16 rounded-2xl bg-orange-100 text-[#ff7a30] text-2xl font-bold">
                  02
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-zinc-900 mb-3">Contradiction Detection</h3>
                  <p className="text-lg text-zinc-600 leading-relaxed">
                    Log your vast array of sources and allow our advanced AI to automatically scan and identify conceptual clashes or conflicting data points across thousands of pages instantly.
                  </p>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="flex flex-col md:flex-row gap-8 p-8 rounded-3xl bg-zinc-50 border border-zinc-100 hover:shadow-lg transition-shadow duration-300">
                <div className="flex-shrink-0 flex items-center justify-center w-16 h-16 rounded-2xl bg-orange-100 text-[#ff7a30] text-2xl font-bold">
                  03
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-zinc-900 mb-3">Claim Validation</h3>
                  <p className="text-lg text-zinc-600 leading-relaxed">
                    Upload new documentation and run rigorous checks to verify whether external claims are genuinely and strongly supported by your underlying ground-truth evidence.
                  </p>
                </div>
              </div>

              {/* Feature 4 */}
              <div className="flex flex-col md:flex-row gap-8 p-8 rounded-3xl bg-zinc-50 border border-zinc-100 hover:shadow-lg transition-shadow duration-300">
                <div className="flex-shrink-0 flex items-center justify-center w-16 h-16 rounded-2xl bg-orange-100 text-[#ff7a30] text-2xl font-bold">
                  04
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-zinc-900 mb-3">Hypothesis Generation</h3>
                  <p className="text-lg text-zinc-600 leading-relaxed">
                    Turn the AI into an active sounding board. By synthesizing logged data, it can proactively propose novel research directions, missing links, and unexplored hypotheses.
                  </p>
                </div>
              </div>
            </div>
            
          </div>
        </section>

        {/* Simple Footer */}
        <footer className="py-8 text-center text-zinc-500 border-t border-zinc-200 text-sm">
          <p>© {new Date().getFullYear()} PHD Workspace. All rights reserved.</p>
        </footer>

      </main>
    </div>
  );
}
