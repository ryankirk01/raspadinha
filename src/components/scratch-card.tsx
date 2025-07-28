
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
  const containerRef = useRef<HTMLDivElement>(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const isDrawing = useRef(false);
  const hasCalledOnComplete = useRef(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const lastCheck = useRef(0);
  const confettiTriggered = useRef(false);

  const particles = useRef<Particle[]>([]);
  
  const [dimensions, setDimensions] = useState({ W: 350, H: 175 });
  
  useEffect(() => {
    if (isDrawing.current) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [isDrawing.current]);

  const initCanvas = useCallback(() => {
    const canvas = scratchCanvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const { width, height } = container.getBoundingClientRect();
    setDimensions({ W: width, H: height });
    canvas.width = width;
    canvas.height = height;

    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, '#d4af37'); 
    gradient.addColorStop(0.2, '#ffd700');
    gradient.addColorStop(0.4, '#f0e68c');
    gradient.addColorStop(0.6, '#d4af37');
    gradient.addColorStop(0.8, '#daa520');
    gradient.addColorStop(1, '#b8860b');

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
    
    ctx.font = 'bold 20px Poppins';
    ctx.fillStyle = 'rgba(0,0,0,0.4)';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('RASPE AQUI SUA SORTE', width / 2, height / 2);


    ctx.globalCompositeOperation = 'destination-out';
  }, []);

  useEffect(() => {
    initCanvas();
    window.addEventListener('resize', initCanvas);
    
    if (typeof Audio !== 'undefined') {
      audioRef.current = new Audio('https://cdn.pixabay.com/audio/2022/03/15/audio_19d906d09a.mp3');
      audioRef.current.preload = 'auto';
    }

    return () => window.removeEventListener('resize', initCanvas);
  }, [initCanvas]);

  const scratch = useCallback((ctx: CanvasRenderingContext2D, x: number, y: number) => {
    ctx.beginPath();
    ctx.arc(x, y, 35, 0, 2 * Math.PI, true);
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
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;
    
    const { W, H } = dimensions;

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
      if (!hasCalledOnComplete.current) {
        setIsRevealed(true);
        onComplete();
        playSound();
        hasCalledOnComplete.current = true;
      }
    }
  }, [onComplete, onUpdate, dimensions, playSound]);

  const handleStart = (e: React.MouseEvent | React.TouchEvent) => {
    isDrawing.current = true;
  };

  const handleEnd = () => {
    if (isDrawing.current) {
      checkRevealed(); 
    }
    isDrawing.current = false;
  };

  const handleMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (hasCalledOnComplete.current || !isDrawing.current) return;
    
    e.preventDefault();

    const canvas = scratchCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e.nativeEvent ? e.nativeEvent.touches[0].clientX : e.nativeEvent.clientX;
    const clientY = 'touches' in e.nativeEvent ? e.nativeEvent.touches[0].clientY : e.nativeEvent.clientY;
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    scratch(ctx, x, y);

    const now = Date.now();
    if (now - lastCheck.current > 100) { 
        lastCheck.current = now;
        checkRevealed();
    }
  };
  
  useEffect(() => {
    if (!isRevealed || confettiTriggered.current) return;
    confettiTriggered.current = true;

    const canvas = confettiCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const container = containerRef.current;
    if (!container) return;
    const { width, height } = container.getBoundingClientRect();
    
    canvas.width = width;
    canvas.height = height;

    const particleCount = 700; 
    const colors = ["#FFD700", "#FFA500", "#FFC400", "#FFFFFF", "#FFD700"];
    particles.current = [];

    for (let i = 0; i < particleCount; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 10 + 4;
        const life = Math.random() * 90 + 90;
        particles.current.push({
            x: width / 2,
            y: height / 2,
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
    <Card 
      ref={containerRef}
      className="w-full max-w-sm h-auto aspect-[2/1] bg-[radial-gradient(ellipse_at_center,_hsl(var(--primary)_/_0.4)_0%,_hsl(var(--background))_80%)] p-0 border-2 border-primary shadow-[0_0_30px_hsl(var(--primary)/0.7)]"
    >
      <CardContent className="relative w-full h-full p-0 flex items-center justify-center">
        
        <canvas
          ref={confettiCanvasRef}
          className="absolute inset-0 w-full h-full z-20 pointer-events-none"
        />

        <div className={cn(
          "text-center z-10 flex flex-col items-center gap-1 p-4 opacity-100",
           "bg-black/40 rounded-lg",
           isRevealed && "animate-prize-reveal"
        )}>
            <Gift className="w-12 h-12 text-yellow-300 drop-shadow-[0_2px_5px_rgba(255,215,0,0.7)]" />
            <h3 className="text-xl font-bold uppercase tracking-wider text-white">
                Você Ganhou
            </h3>
            <p className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-b from-yellow-300 to-amber-500" style={{ textShadow: '0 0 20px #ffd700' }}>
                R$100!
            </p>
        </div>


        <canvas
          ref={scratchCanvasRef}
          className={cn(
            'absolute inset-0 z-30 cursor-crosshair rounded-md transition-opacity duration-700 touch-none',
            isRevealed ? 'opacity-0 pointer-events-none' : 'opacity-100'
          )}
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
