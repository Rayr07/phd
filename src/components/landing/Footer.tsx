import Link from "next/link";

export function Footer() {
  return (
    <footer className="py-12 border-t border-border bg-background relative z-10 section-fade">
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-accent text-white flex items-center justify-center font-bold text-xs">
            P
          </div>
          <span className="font-bold text-foreground">PHD Workspace</span>
        </div>
        
        <div className="text-sm text-foreground/60 font-medium">
          © {new Date().getFullYear()} PHD Workspace. All rights reserved.
        </div>

        <div className="flex gap-6 text-sm font-medium text-foreground/70">
          <Link href="/login" className="hover:text-accent transition-colors">Log In</Link>
          <a href="#" className="hover:text-accent transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-accent transition-colors">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
}
