import { useEffect, useState } from "react";

export function FloatingBackground() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
      {/* Decorative Blur Circles */}
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-[#ff7a30] opacity-10 dark:opacity-5 rounded-full blur-3xl animate-pulse [animation-duration:8s] delay-0" />
      <div className="absolute top-40 -left-20 w-72 h-72 bg-[#465c88] dark:bg-[#5f9598] opacity-10 dark:opacity-40 rounded-full blur-3xl animate-pulse [animation-duration:4s] delay-1000" />
      <div className="absolute bottom-40 left-1/3 w-64 h-64 bg-[#465c88] dark:bg-[#5f9598] opacity-10 dark:opacity-40 rounded-full blur-3xl animate-pulse [animation-duration:5s] delay-700" />
      <div className="absolute bottom-10 right-20 w-80 h-80 bg-[#ff7a30] opacity-5 dark:opacity-[0.02] rounded-full blur-3xl animate-pulse [animation-duration:10s] delay-500" />
      
      {/* Subtle Grid Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
    </div>
  );
}
