export function ContactForm() {
  return (
    <section className="py-24 px-6 relative z-10 section-fade">
      <div className="max-w-2xl mx-auto bg-card border border-border p-8 md:p-12 rounded-3xl shadow-lg">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold tracking-tight text-foreground mb-2">Get in Touch</h2>
          <p className="text-foreground/70">Have questions about PHD Workspace? Drop us a message.</p>
        </div>

        <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-semibold text-foreground/80">Name</label>
            <input 
              id="name" 
              type="text" 
              placeholder="Dr. John Doe"
              className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/50 transition-colors"
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-semibold text-foreground/80">Email</label>
            <input 
              id="email" 
              type="email" 
              placeholder="john@university.edu"
              className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/50 transition-colors"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="message" className="text-sm font-semibold text-foreground/80">Message</label>
            <textarea 
              id="message" 
              rows={4} 
              placeholder="I am interested in using PHD for my lab..."
              className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/50 transition-colors resize-none"
            />
          </div>

          <button 
            type="submit" 
            className="w-full py-4 bg-foreground text-background hover:bg-foreground/90 font-bold rounded-xl transition-colors"
          >
            Send Message
          </button>
        </form>
      </div>
    </section>
  );
}
