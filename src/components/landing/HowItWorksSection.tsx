import { Upload, Cpu, Lightbulb } from "lucide-react";

export function HowItWorksSection() {
  const steps = [
    {
      icon: <Upload className="w-8 h-8" />,
      title: "Upload Ground Truths",
      description: "Securely upload your PDFs, datasets, and research literature to your dedicated workspace."
    },
    {
      icon: <Cpu className="w-8 h-8" />,
      title: "Process & Contextualize",
      description: "Our RAG architecture intelligently chunks and embeds your documents for sub-second retrieval."
    },
    {
      icon: <Lightbulb className="w-8 h-8" />,
      title: "Discover Insights",
      description: "Query the system to find contradictions, validate claims against your evidence, and generate new hypotheses."
    }
  ];

  return (
    <section id="how-it-works" className="py-24 px-6 relative z-10 section-fade">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-4">
            How It Works
          </h2>
          <p className="text-xl text-foreground/70 max-w-2xl mx-auto">
            A streamlined workflow designed to accelerate your research cycle without compromising accuracy.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative group">
              <div className="bg-card border border-foreground/10 p-8 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 h-full flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-2xl bg-accent/10 text-accent flex items-center justify-center mb-6 shadow-inner group-hover:scale-110 transition-transform">
                  {step.icon}
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-4">{step.title}</h3>
                <p className="text-foreground/70 leading-relaxed font-medium">
                  {step.description}
                </p>
              </div>
              
              {/* Connector line for desktop */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-border -translate-y-1/2 z-0" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
