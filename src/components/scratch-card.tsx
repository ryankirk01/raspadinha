
"use client";

import { useRef, useState, useEffect, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Gift } from 'lucide-react';
import { cn } from '@/lib/utils';

// Particle type for the explosion effect
type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  life: number;
  initialLife: number;
  gravity: number;
};

export function ScratchCard({ onComplete }: { onComplete: () => void }) {
  const scratchCanvasRef = useRef<HTMLCanvasElement>(null);
  const confettiCanvasRef = useRef<HTMLCanvasElement>(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const isDrawing = useRef(false);
  const hasCalledOnComplete = useRef(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const particles = useRef<Particle[]>([]);

  const W = 350;
  const H = 150;

  // Initialize scratch surface and audio
  useEffect(() => {
    const canvas = scratchCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Create a metallic gradient for the scratch surface
    const gradient = ctx.createLinearGradient(0, 0, W, H);
    gradient.addColorStop(0, '#B4B4B4');
    gradient.addColorStop(0.2, '#E0E0E0');
    gradient.addColorStop(0.4, '#B4B4B4');
    gradient.addColorStop(0.6, '#9C9C9C');
    gradient.addColorStop(0.8, '#E0E0E0');
    gradient.addColorStop(1, '#B4B4B4');

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, W, H);

    ctx.globalCompositeOperation = 'destination-out';
    
    // Preload audio
    if (typeof Audio !== 'undefined') {
      audioRef.current = new Audio('https://cdn.pixabay.com/audio/2022/03/15/audio_2b68551ada.mp3');
      audioRef.current.preload = 'auto';
    }

  }, []);
  
  const scratch = useCallback((ctx: CanvasRenderingContext2D, x: number, y: number) => {
    ctx.beginPath();
    ctx.arc(x, y, 25, 0, 2 * Math.PI, true);
    ctx.fill();
  }, []);

  const playSound = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(error => console.error("Audio play failed:", error));
    }
  }

  const checkRevealed = useCallback(() => {
    if (isRevealed || hasCalledOnComplete.current) return;
    const canvas = scratchCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const imageData = ctx.getImageData(0, 0, W, H);
    const data = imageData.data;
    let transparentPixels = 0;
    for (let i = 3; i < data.length; i += 4) {
      if (data[i] === 0) {
        transparentPixels++;
      }
    }
    
    const percentage = (transparentPixels / (W * H)) * 100;
    if (percentage > 70) {
      setIsRevealed(true);
      if (!hasCalledOnComplete.current) {
        onComplete();
        playSound();
        hasCalledOnComplete.current = true;
      }
    }
  }, [isRevealed, onComplete]);

  const handleStart = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    isDrawing.current = true;
    handleMove(e);
  };

  const handleEnd = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    isDrawing.current = false;
    checkRevealed();
  };

  const handleMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing.current || isRevealed) return;
    e.preventDefault();
    const canvas = scratchCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    scratch(ctx, x, y);
  };
  
  // Explosion effect animation
  useEffect(() => {
    if (!isRevealed) return;

    const canvas = confettiCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    canvas.width = W;
    canvas.height = H;

    const particleCount = 300;
    const colors = ["#fde047", "#f97316", "#facc15", "#ffffff", "#eab308"];
    particles.current = [];

    for (let i = 0; i < particleCount; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 8 + 3;
        const life = Math.random() * 80 + 80; // a bit longer life
        particles.current.push({
            x: W / 2,
            y: H / 2,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            radius: Math.random() * 2.5 + 1.5,
            color: colors[Math.floor(Math.random() * colors.length)],
            life: life,
            initialLife: life,
            gravity: 0.1,
        });
    }

    let animationFrameId: number;

    const drawParticles = () => {
        if (!ctx || !canvas) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.current.forEach((p, index) => {
            p.x += p.vx;
            p.y += p.vy;
            p.vy += p.gravity;
            p.life -= 1;
            
            const alpha = Math.max(0, p.life / p.initialLife);

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2, false);
            ctx.fillStyle = `${p.color}${Math.round(alpha * 255).toString(16).padStart(2, '0')}`;
            ctx.fill();

            if (p.life <= 0) {
              particles.current.splice(index, 1);
            }
        });

        if (particles.current.length > 0) {
            animationFrameId = requestAnimationFrame(drawParticles);
        } else {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
    };

    drawParticles();

    return () => {
        cancelAnimationFrame(animationFrameId);
    };
}, [isRevealed]);


  return (
    <Card className="w-[350px] h-[150px] bg-gradient-to-br from-yellow-300 via-primary to-amber-600 p-0 border-2 border-primary shadow-[0_0_30px_hsl(var(--primary)/0.7)]">
      <CardContent className="relative w-full h-full p-0 flex items-center justify-center">
        
        <canvas
          ref={confettiCanvasRef}
          className="absolute top-0 left-0 w-full h-full z-20 pointer-events-none"
        />

        <div className="absolute inset-0 bg-black/60 z-10"></div>

        <div className={cn(
          "text-center z-10 text-background flex flex-col items-center gap-1 p-4 transition-all duration-700",
          isRevealed && "animate-pulse"
        )}>
            <Gift className="w-10 h-10 text-yellow-300 drop-shadow-lg" />
            <h3 className="text-xl font-black text-white text-glow">
                VOCÊ GANHOU R$100!
            </h3>
            <p className="text-xs font-bold text-yellow-200 px-4">
                Cadastre-se e faça seu primeiro depósito para resgatar seu prêmio.
            </p>
        </div>


        <canvas
          ref={scratchCanvasRef}
          width={W}
          height={H}
          className={`absolute top-0 left-0 w-full h-full z-30 cursor-pointer rounded-md transition-opacity duration-700 ${isRevealed ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
          onMouseDown={handleStart}
          onMouseMove={handleMove}
          onMouseUp={handleEnd}
          onMouseLeave={handleEnd}
          onTouchStart={handleStart}
          onTouchMove={handleMove}
          onTouchEnd={handleEnd}
        />
      </CardContent>
    </Card>
  );
}
