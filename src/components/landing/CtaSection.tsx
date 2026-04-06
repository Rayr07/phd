import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function CtaSection() {
  return (
    <section className="py-32 px-6 relative z-10 section-fade">
      <div className="max-w-4xl mx-auto text-center bg-gradient-to-br from-accent/20 to-transparent p-12 md:p-20 rounded-[3rem] border border-accent/20 shadow-2xl relative overflow-hidden backdrop-blur-md">
        
        {/* Decorative background shapes */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-accent/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3" />

        <div className="relative z-10">
          <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight text-foreground mb-6">
            Ready to elevate your research?
          </h2>
          <p className="text-xl text-foreground/70 mb-10 max-w-2xl mx-auto font-medium">
            Join the ecosystem built meticulously for researchers who demand precision, speed, and analytical superiority.
          </p>
          <Link 
            href="/signup" 
            className="inline-flex items-center justify-center gap-2 px-10 py-5 bg-accent hover:bg-[#e66a25] dark:bg-primary dark:hover:bg-[#4d7b7e] text-white rounded-full font-bold text-xl transition-all duration-300 transform hover:scale-105 shadow-[0_8px_30px_rgba(255,122,48,0.4)] dark:shadow-[0_8px_30px_rgba(95,149,152,0.4)]"
          >
            Create Your Workspace
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

      </div>
    </section>
  );
}
