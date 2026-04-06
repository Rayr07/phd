'use client';

import React, { useEffect, useRef } from 'react';

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  alpha: number;
  targetAlpha: number;
};

const SPECKLE_COLORS = [
  '#465c88', // Light Primary
  '#ff7a30', // Light Accent
  '#5f9598', // Dark Primary
  '#d4c9be', // Dark Accent
  '#8ea5cc', // Mix
  '#f5a77d', // Mix
];

export const SpeckleBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let particles: Particle[] = [];
    let animationFrameId: number;
    let width = 0;
    let height = 0;
    let mouse = { x: -1000, y: -1000 }; // off-screen initially

    const initCanvas = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      initParticles();
    };

    const initParticles = () => {
      particles = [];
      // Adjust particle count based on screen size
      const maxParticles = Math.floor((width * height) / 10000); 
      for (let i = 0; i < maxParticles; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          radius: Math.random() * 2.5 + 0.5,
          color: SPECKLE_COLORS[Math.floor(Math.random() * SPECKLE_COLORS.length)],
          alpha: Math.random() * 0.6 + 0.4,
          targetAlpha: Math.random() * 0.6 + 0.4,
        });
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        // Move
        p.x += p.vx;
        p.y += p.vy;

        // Bounce off edges smoothly
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        // Gentle pulse effect
        if (Math.abs(p.alpha - p.targetAlpha) < 0.01) {
            p.targetAlpha = Math.random() * 0.6 + 0.4;
        } else {
            p.alpha += (p.targetAlpha - p.alpha) * 0.01;
        }

        // Draw particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        
        // Connect to mouse if close enough
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const distSq = dx * dx + dy * dy;
        const maxDist = 150;
        
        if (distSq < maxDist * maxDist) {
            // Push away slightly
            const dist = Math.sqrt(distSq);
            if (dist > 0) {
              p.x += (dx / dist) * 0.5;
              p.y += (dy / dist) * 0.5;
            }
            
            // Connect line
            ctx.fill();
            ctx.globalAlpha = (1 - dist / maxDist) * 0.6;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.strokeStyle = p.color;
            ctx.lineWidth = 0.5;
            ctx.stroke();
        } else {
            ctx.fill();
        }
      });
      ctx.globalAlpha = 1.0;

      animationFrameId = requestAnimationFrame(animate);
    };

    initCanvas();
    animate();

    const handleResize = () => {
      initCanvas();
    };
    
    const handleMouseMove = (e: MouseEvent) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    };

    const handleMouseOut = () => {
        mouse.x = -1000;
        mouse.y = -1000;
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseout', handleMouseOut);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseout', handleMouseOut);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: 1 }}
    />
  );
};
