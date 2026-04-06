export function ProjectDashboard() {
  return (
    <section id="dashboard" className="py-24 px-6 relative z-10 section-fade">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-4">
            A Pristine Workspace
          </h2>
          <p className="text-xl text-foreground/70 max-w-3xl mx-auto">
            Everything you need organized intuitively. Your projects, sources, and AI chats seamlessly integrated.
          </p>
        </div>

        <div className="relative mx-auto rounded-xl border border-foreground/10 bg-card shadow-2xl overflow-hidden aspect-[16/9] md:aspect-[21/9]">
          {/* Mac-like window controls bar */}
          <div className="bg-zinc-100 dark:bg-zinc-900 border-b border-foreground/5 p-3 flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-400" />
            <div className="w-3 h-3 rounded-full bg-amber-400" />
            <div className="w-3 h-3 rounded-full bg-green-400" />
            <div className="mx-auto bg-zinc-200 dark:bg-zinc-800 text-xs font-mono px-4 py-1 rounded text-foreground/50">
              app.phdworkspace.com
            </div>
          </div>
          
          {/* Dashboard Mockup Content */}
          <div className="flex h-full bg-background/50">
            {/* Sidebar */}
            <div className="w-1/4 border-r border-foreground/5 p-4 flex flex-col gap-4">
              <div className="h-8 bg-foreground/5 rounded w-1/2 mb-4" />
              <div className="h-6 bg-foreground/10 rounded" />
              <div className="h-6 bg-foreground/5 rounded w-5/6" />
              <div className="h-6 bg-foreground/5 rounded w-4/6" />
              <div className="mt-auto h-10 bg-accent/20 rounded" />
            </div>
            {/* Main Area */}
            <div className="flex-1 p-8 flex flex-col gap-6">
              <div className="flex justify-between">
                <div className="h-8 bg-foreground/10 rounded w-1/3" />
                <div className="h-8 bg-accent/80 rounded w-24" />
              </div>
              <div className="flex gap-4 mb-4">
                <div className="h-32 flex-1 bg-card border border-foreground/5 shadow-sm rounded-xl" />
                <div className="h-32 flex-1 bg-card border border-foreground/5 shadow-sm rounded-xl" />
                <div className="h-32 flex-1 bg-card border border-foreground/5 shadow-sm rounded-xl" />
              </div>
              <div className="flex-1 bg-card border border-foreground/5 shadow-sm rounded-xl p-4">
                <div className="h-6 bg-foreground/5 rounded w-1/4 mb-4" />
                <div className="h-4 bg-foreground/5 rounded w-full mb-2" />
                <div className="h-4 bg-foreground/5 rounded w-full mb-2" />
                <div className="h-4 bg-foreground/5 rounded w-3/4" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
