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

export function Particles({ className, quantity = 100 }: { className?: string; quantity?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let particlesArray: Particle[] = [];
    const colors = ['#BE29EC', '#29D0EC', '#FFFFFF'];

    const setCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const createParticles = () => {
      particlesArray = [];
      const numberOfParticles = (canvas.width * canvas.height) / 9000;
      for (let i = 0; i < quantity; i++) {
        const size = Math.random() * 2 + 1;
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const speedX = Math.random() * 1 - 0.5;
        const speedY = Math.random() * 1 - 0.5;
        const color = colors[Math.floor(Math.random() * colors.length)];
        particlesArray.push({ x, y, size, speedX, speedY, color });
      }
    };

    const animateParticles = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < particlesArray.length; i++) {
        const particle = particlesArray[i];
        particle.x += particle.speedX;
        particle.y += particle.speedY;

        if (particle.x > canvas.width || particle.x < 0) {
          particle.speedX *= -1;
        }
        if (particle.y > canvas.height || particle.y < 0) {
          particle.speedY *= -1;
        }

        ctx.fillStyle = particle.color;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
      }
      requestAnimationFrame(animateParticles);
    };

    const handleResize = () => {
      setCanvasSize();
      createParticles();
    };

    setCanvasSize();
    createParticles();
    animateParticles();

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [quantity]);

  return <canvas ref={canvasRef} className={cn('absolute top-0 left-0 w-full h-full -z-10', className)} />;
}
