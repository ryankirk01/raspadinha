
"use client";

import { useRef, useState, useEffect, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Gift, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Progress } from "@/components/ui/progress"


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

export function ScratchCard({ onComplete, onUpdate }: { onComplete: () => void; onUpdate: (progress: number) => void; }) {
  const scratchCanvasRef = useRef<HTMLCanvasElement>(null);
  const confettiCanvasRef = useRef<HTMLCanvasElement>(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const isDrawing = useRef(false);
  const hasCalledOnComplete = useRef(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const lastCheck = useRef(0);

  const particles = useRef<Particle[]>([]);

  const W = 400;
  const H = 200;

  useEffect(() => {
    const canvas = scratchCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const gradient = ctx.createLinearGradient(0, 0, W, H);
    gradient.addColorStop(0, '#d4af37'); 
    gradient.addColorStop(0.2, '#ffd700');
    gradient.addColorStop(0.4, '#f0e68c');
    gradient.addColorStop(0.6, '#d4af37');
    gradient.addColorStop(0.8, '#daa520');
    gradient.addColorStop(1, '#b8860b');

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, W, H);
    
    ctx.font = 'bold 24px Poppins';
    ctx.fillStyle = 'rgba(0,0,0,0.4)';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('RASPE AQUI SUA SORTE', W / 2, H / 2);


    ctx.globalCompositeOperation = 'destination-out';
    
    if (typeof Audio !== 'undefined') {
      audioRef.current = new Audio('https://cdn.pixabay.com/audio/2022/03/15/audio_19d906d09a.mp3');
      audioRef.current.preload = 'auto';
    }

  }, []);
  
  const scratch = useCallback((ctx: CanvasRenderingContext2D, x: number, y: number) => {
    ctx.beginPath();
    ctx.arc(x, y, 45, 0, 2 * Math.PI, true);
    ctx.fill();
  }, []);

  const playSound = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(error => console.error("Audio play failed:", error));
    }
  }

  const checkRevealed = useCallback(() => {
    const canvas = scratchCanvasRef.current;
    if (!canvas || hasCalledOnComplete.current) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const imageData = ctx.getImageData(0, 0, W, H);
    const data = imageData.data;
    let transparentPixels = 0;
    for (let i = 3; i < data.length; i += 4) {
      if (data[i] < 128) {
        transparentPixels++;
      }
    }
    
    const percentage = (transparentPixels / (W * H)) * 100;
    onUpdate(percentage);

    if (percentage > 60) {
      setIsRevealed(true);
      if (!hasCalledOnComplete.current) {
        onComplete();
        playSound();
        hasCalledOnComplete.current = true;
      }
    }
  }, [onComplete, onUpdate]);


  const handleStart = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    isDrawing.current = true;
    handleMove(e);
  };

  const handleEnd = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    if (isDrawing.current) {
        isDrawing.current = false;
        checkRevealed(); // Final check on mouse up
    }
  };

  const handleMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing.current || hasCalledOnComplete.current) return;
    e.preventDefault();
    const canvas = scratchCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    scratch(ctx, x, y);

    const now = Date.now();
    if (now - lastCheck.current > 100) { // Check every 100ms
        lastCheck.current = now;
        checkRevealed();
    }
  };
  
  useEffect(() => {
    if (!isRevealed) return;

    const canvas = confettiCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    canvas.width = W;
    canvas.height = H;

    const particleCount = 700; 
    const colors = ["#FFD700", "#FFA500", "#FFC400", "#FFFFFF", "#FFD700"];
    particles.current = [];

    for (let i = 0; i < particleCount; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 10 + 4;
        const life = Math.random() * 90 + 90;
        particles.current.push({
            x: W / 2,
            y: H / 2,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            radius: Math.random() * 3 + 2,
            color: colors[Math.floor(Math.random() * colors.length)],
            life: life,
            initialLife: life,
            gravity: 0.15,
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
            
            const lifeRatio = Math.max(0, p.life / p.initialLife);
            const radius = p.radius * lifeRatio;

            if (radius > 0) {
              ctx.beginPath();
              const alpha = lifeRatio;
              ctx.globalAlpha = alpha;
              ctx.arc(p.x, p.y, radius, 0, Math.PI * 2, false);
              ctx.fillStyle = p.color;
              ctx.fill();
              ctx.globalAlpha = 1;
            }

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
    <Card className="w-[400px] h-[200px] bg-gradient-to-br from-yellow-300 via-primary to-amber-600 p-0 border-2 border-primary shadow-[0_0_30px_hsl(var(--primary)/0.7)]">
      <CardContent className="relative w-full h-full p-0 flex items-center justify-center">
        
        <canvas
          ref={confettiCanvasRef}
          className="absolute top-0 left-0 w-full h-full z-20 pointer-events-none"
        />

        <div className="absolute inset-0 z-10 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.6)_0%,rgba(0,0,0,0)_80%)]"></div>

        <div className={cn(
          "text-center z-10 text-background flex flex-col items-center gap-1 p-4 transition-all duration-700",
           isRevealed && "animate-prize-reveal"
        )}>
            <Gift className="w-12 h-12 text-yellow-300 drop-shadow-lg" />
            <h3 className="text-2xl font-black text-white text-glow animate-pulse-strong">
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
          className={`absolute top-0 left-0 w-full h-full z-30 cursor-crosshair rounded-md transition-opacity duration-700 ${isRevealed ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
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

export function ScratchProgress({ progress }: { progress: number }) {
  return (
     <div className="w-full max-w-xs px-4">
      <div className="flex justify-between items-center mb-1">
        <span className="text-xs font-semibold text-primary/80">Medidor de Sorte</span>
        <Sparkles className="w-4 h-4 text-primary" />
      </div>
      <Progress value={progress} className="w-full h-3 bg-primary/20 border border-primary/30" />
    </div>
  )
}
