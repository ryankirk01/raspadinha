"use client";

import { useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

type Particle = {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  color: string;
};

export function Particles({ className, quantity = 150 }: { className?: string; quantity?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouse = useRef<{ x: number | null, y: number | null }>({ x: null, y: null });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let particlesArray: Particle[] = [];
    const colors = ['hsl(var(--primary))', 'hsl(var(--accent))', '#FFFFFF'];

    const setCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const createParticles = () => {
      particlesArray = [];
      const numberOfParticles = quantity;
      for (let i = 0; i < numberOfParticles; i++) {
        const size = Math.random() * 2.5 + 1;
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const speedX = Math.random() * 0.4 - 0.2;
        const speedY = Math.random() * 0.4 - 0.2;
        const color = colors[Math.floor(Math.random() * colors.length)];
        particlesArray.push({ x, y, size, speedX, speedY, color });
      }
    };

    const animateParticles = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < particlesArray.length; i++) {
        const p = particlesArray[i];
        p.x += p.speedX;
        p.y += p.speedY;

        if (p.x > canvas.width || p.x < 0) p.speedX *= -1;
        if (p.y > canvas.height || p.y < 0) p.speedY *= -1;
        
        if (mouse.current.x && mouse.current.y) {
          const dx = mouse.current.x - p.x;
          const dy = mouse.current.y - p.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < 100) {
              const forceDirectionX = dx / distance;
              const forceDirectionY = dy / distance;
              const force = (100 - distance) / 100;
              p.x -= forceDirectionX * force * 0.5;
              p.y -= forceDirectionY * force * 0.5;
          }
        }

        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }
      requestAnimationFrame(animateParticles);
    };

    const handleResize = () => {
      setCanvasSize();
      createParticles();
    };

    const handleMouseMove = (event: MouseEvent) => {
        mouse.current.x = event.x;
        mouse.current.y = event.y;
    };
    
    const handleMouseOut = () => {
        mouse.current.x = null;
        mouse.current.y = null;
    }

    setCanvasSize();
    createParticles();
    animateParticles();

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseout', handleMouseOut);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseout', handleMouseOut);
    };
  }, [quantity]);

  return <canvas ref={canvasRef} className={cn('absolute top-0 left-0 w-full h-full -z-10', className)} />;
}
