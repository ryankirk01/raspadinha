"use client";

import { useRef, useState, useEffect, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';

// Confetti particle type
type ConfettiParticle = {
  x: number;
  y: number;
  r: number;
  d: number;
  color: string;
  tilt: number;
};

export function ScratchCard() {
  const scratchCanvasRef = useRef<HTMLCanvasElement>(null);
  const confettiCanvasRef = useRef<HTMLCanvasElement>(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const isDrawing = useRef(false);

  // Confetti state
  const confettiParticles = useRef<ConfettiParticle[]>([]);

  const W = 350;
  const H = 150;

  // Initialize scratch surface
  useEffect(() => {
    const canvas = scratchCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#C0C0C0'; // Silver color
    ctx.fillRect(0, 0, W, H);
    ctx.globalCompositeOperation = 'destination-out';
  }, []);
  
  const scratch = useCallback((ctx: CanvasRenderingContext2D, x: number, y: number) => {
    ctx.beginPath();
    ctx.arc(x, y, 20, 0, 2 * Math.PI);
    ctx.fill();
  }, []);

  const checkRevealed = useCallback(() => {
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
    }
  }, []);

  const handleStart = (e: React.MouseEvent | React.TouchEvent) => {
    isDrawing.current = true;
    handleMove(e);
  };

  const handleEnd = () => {
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
  
  // Confetti animation
  useEffect(() => {
    if (!isRevealed) return;

    const confettiCanvas = confettiCanvasRef.current;
    if (!confettiCanvas) return;
    const ctx = confettiCanvas.getContext('2d');
    if (!ctx) return;
    
    confettiCanvas.width = W;
    confettiCanvas.height = H;

    const maxConfettis = 150;
    const colors = ["#BE29EC", "#29D0EC", "#f2c642", "#ffffff"];
    confettiParticles.current = [];

    for (let i = 0; i < maxConfettis; i++) {
        confettiParticles.current.push({
            x: Math.random() * W,
            y: Math.random() * H - H,
            r: Math.random() * 4 + 1,
            d: Math.random() * maxConfettis,
            color: colors[Math.floor(Math.random() * colors.length)],
            tilt: Math.floor(Math.random() * 10) - 10,
        });
    }

    let animationFrameId: number;

    const drawConfetti = () => {
        ctx.clearRect(0, 0, W, H);
        confettiParticles.current.forEach((p, i) => {
            ctx.beginPath();
            ctx.lineWidth = p.r / 2;
            ctx.strokeStyle = p.color;
            ctx.moveTo(p.x + p.tilt + p.r, p.y);
            ctx.lineTo(p.x + p.tilt, p.y + p.tilt + p.r);
            ctx.stroke();

            p.y += Math.cos(p.d + i + 1.5) + p.r/2;
            p.x += Math.sin(p.d) * 2;
            p.tilt = (Math.sin(p.d) * 15);
            
            if (p.y > H) {
                confettiParticles.current[i] = { ...p, x: Math.random() * W, y: -10, };
            }
        });
        animationFrameId = requestAnimationFrame(drawConfetti);
    };

    drawConfetti();

    return () => {
        cancelAnimationFrame(animationFrameId);
    };
}, [isRevealed]);


  return (
    <Card className="w-[350px] h-[150px] bg-gradient-to-br from-primary via-purple-900 to-accent p-0 border-2 border-accent shadow-[0_0_20px_hsl(var(--accent))]">
      <CardContent className="relative w-full h-full p-0 flex items-center justify-center">
        <div className="text-center z-10">
          <h3 className="text-xl font-bold text-white text-glow">
            Você desbloqueou sua chance exclusiva!
          </h3>
        </div>

        <canvas
          ref={confettiCanvasRef}
          className="absolute top-0 left-0 w-full h-full z-20 pointer-events-none"
        />

        <canvas
          ref={scratchCanvasRef}
          width={W}
          height={H}
          className={`absolute top-0 left-0 w-full h-full z-30 cursor-pointer rounded-md transition-opacity duration-700 ${isRevealed ? 'opacity-0' : 'opacity-100'}`}
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
