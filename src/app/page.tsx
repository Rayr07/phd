"use client";

import { useEffect } from "react";
import { FloatingBackground } from "@/components/landing/FloatingBackground";
import { Header } from "@/components/landing/Header";
import { HeroSection } from "@/components/landing/HeroSection";
import { HowItWorksSection } from "@/components/landing/HowItWorksSection";
import { ProjectDashboard } from "@/components/landing/ProjectDashboard";
import { FeatureHighlightsSection } from "@/components/landing/FeatureHighlightsSection";
import { CtaSection } from "@/components/landing/CtaSection";
import { ContactForm } from "@/components/landing/ContactForm";
import { Footer } from "@/components/landing/Footer";

export default function Home() {
  useEffect(() => {
    const sections = document.querySelectorAll(".section-fade");
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            // Optional: stop observing once it's visible
            // observer.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.12 }
    );

    sections.forEach((section) => observer.observe(section));
    
    return () => observer.disconnect();
  }, []);

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-background text-foreground transition-colors duration-300">
      <FloatingBackground />
      <Header />
      <main>
        <HeroSection />
        <HowItWorksSection />
        <ProjectDashboard />
        <FeatureHighlightsSection />
        <CtaSection />
        <ContactForm />
      </main>
      <Footer />
    </div>
  );
}

