"use client";

import { useRef, useState, useEffect, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Gift } from 'lucide-react';

// Confetti particle type
type ConfettiParticle = {
  x: number;
  y: number;
  r: number;
  d: number;
  color: string;
  tilt: number;
  tiltAngle: number;
};

export function ScratchCard({ onComplete }: { onComplete: () => void }) {
  const scratchCanvasRef = useRef<HTMLCanvasElement>(null);
  const confettiCanvasRef = useRef<HTMLCanvasElement>(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const isDrawing = useRef(false);
  const hasCalledOnComplete = useRef(false);

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
  }, []);
  
  const scratch = useCallback((ctx: CanvasRenderingContext2D, x: number, y: number) => {
    ctx.beginPath();
    ctx.arc(x, y, 25, 0, 2 * Math.PI, true);
    ctx.fill();
  }, []);

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
    const colors = ["#fde047", "#f97316", "#facc15", "#ffffff"];
    confettiParticles.current = [];

    for (let i = 0; i < maxConfettis; i++) {
        confettiParticles.current.push({
            x: Math.random() * W,
            y: Math.random() * H - H,
            r: Math.random() * 4 + 1,
            d: Math.random() * maxConfettis,
            color: colors[Math.floor(Math.random() * colors.length)],
            tilt: Math.floor(Math.random() * 10) - 10,
            tiltAngle: 0,
        });
    }

    let animationFrameId: number;

    const drawConfetti = () => {
        if (!ctx) return;
        ctx.clearRect(0, 0, W, H);
        confettiParticles.current.forEach((p, i) => {
            ctx.beginPath();
            ctx.lineWidth = p.r;
            ctx.strokeStyle = p.color;
            ctx.moveTo(p.x + p.tilt, p.y);
            ctx.lineTo(p.x, p.y + p.tilt + p.r);
            ctx.stroke();

            p.tiltAngle += 0.07;
            p.y += (Math.cos(p.d) + 3 + p.r/2) * 0.5;
            p.x += Math.sin(p.d);
            p.tilt = (Math.sin(p.d) * 15);
            
            if (p.y > H) {
                confettiParticles.current[i] = { ...p, x: Math.random() * W, y: -20, };
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
    <Card className="w-[350px] h-[150px] bg-gradient-to-br from-yellow-300 via-primary to-amber-600 p-0 border-2 border-primary shadow-[0_0_30px_hsl(var(--primary)/0.7)]">
      <CardContent className="relative w-full h-full p-0 flex items-center justify-center">
        
        <canvas
          ref={confettiCanvasRef}
          className="absolute top-0 left-0 w-full h-full z-20 pointer-events-none"
        />

        <div className="text-center z-10 text-background flex flex-col items-center gap-2 p-4 transition-all duration-700">
            <Gift className="w-12 h-12 text-yellow-300 drop-shadow-lg" />
            <h3 className="text-2xl font-black text-white text-glow">
                VOCÊ GANHOU!
            </h3>
            <p className="text-sm font-bold text-yellow-200">Raspe para revelar seu prêmio</p>
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
