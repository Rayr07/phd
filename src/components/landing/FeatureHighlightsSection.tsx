export function FeatureHighlightsSection() {
  const features = [
    {
      title: "Contradiction Detection",
      description: "Log your vast array of sources and allow our advanced AI to automatically scan and identify conceptual clashes or conflicting data points across thousands of pages instantly.",
      number: "01"
    },
    {
      title: "Claim Validation",
      description: "Upload new documentation and run rigorous checks to verify whether external claims are genuinely and strongly supported by your underlying ground-truth evidence.",
      number: "02"
    },
    {
      title: "Hypothesis Generation",
      description: "Turn the AI into an active sounding board. By synthesizing logged data, it can proactively propose novel research directions, missing links, and unexplored hypotheses.",
      number: "03"
    }
  ];

  return (
    <section id="features" className="py-24 px-6 relative z-10 section-fade">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-20 bg-background/50 border border-border p-8 rounded-3xl shadow-sm backdrop-blur-sm">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-4">
            Core Capabilities
          </h2>
          <p className="text-xl text-foreground/70 font-medium">
            Robust tools dedicated to ensuring your research is air-tight.
          </p>
        </div>

        <div className="space-y-12">
          {features.map((feature, idx) => (
            <div 
              key={idx} 
              className="flex flex-col md:flex-row gap-8 p-8 rounded-3xl bg-card border border-foreground/10 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="flex-shrink-0 flex items-center justify-center w-16 h-16 rounded-2xl bg-accent/10 text-accent text-2xl font-bold shadow-inner">
                {feature.number}
              </div>
              <div>
                <h3 className="text-2xl font-bold text-foreground mb-3">{feature.title}</h3>
                <p className="text-lg text-foreground/70 leading-relaxed font-medium">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
