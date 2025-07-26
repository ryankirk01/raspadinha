
"use client";

import { useRef, useState, useEffect, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

type TestimonialProps = {
  name: string;
  prize: string;
  mainScratchCompleted: boolean;
};

export function TestimonialScratchCard({ name, prize, mainScratchCompleted }: TestimonialProps) {
  const scratchCanvasRef = useRef<HTMLCanvasElement>(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const W = 320, H = 160;

  const isDrawing = useRef(false);
  const lastCheck = useRef(0);
  const touchStartPos = useRef<{ x: number, y: number } | null>(null);
  const hasCalledOnComplete = useRef(false);

  const getInitials = (name: string) => {
    const names = name.split(' ');
    let initials = names[0].substring(0, 1).toUpperCase();
    if (names.length > 1) {
      initials += names[names.length - 1].substring(0, 1).toUpperCase();
    }
    return initials;
  };
  
  const initCanvas = useCallback(() => {
    const canvas = scratchCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const gradient = ctx.createLinearGradient(0, 0, W, H);
    gradient.addColorStop(0, '#d4af37'); 
    gradient.addColorStop(0.5, '#ffd700');
    gradient.addColorStop(1, '#b8860b');

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, W, H);
    
    ctx.font = 'bold 16px Poppins';
    ctx.fillStyle = 'rgba(0,0,0,0.4)';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('RASPE PARA VER', W / 2, H / 2);

    ctx.globalCompositeOperation = 'destination-out';
  }, [W, H]);

  useEffect(() => {
    if (mainScratchCompleted) {
      initCanvas();
    }
  }, [mainScratchCompleted, initCanvas]);

  const scratch = useCallback((ctx: CanvasRenderingContext2D, x: number, y: number) => {
    ctx.beginPath();
    ctx.arc(x, y, 25, 0, 2 * Math.PI, true);
    ctx.fill();
  }, []);
  
  const checkRevealed = useCallback(() => {
    const canvas = scratchCanvasRef.current;
    if (!canvas || hasCalledOnComplete.current) return;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
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
    if (percentage > 50 && !hasCalledOnComplete.current) {
      setIsRevealed(true);
      hasCalledOnComplete.current = true;
    }
  }, [W, H]);
  
  const handleStart = (e: React.MouseEvent | React.TouchEvent) => {
    isDrawing.current = false;
    if (e.nativeEvent instanceof MouseEvent) {
      isDrawing.current = true;
    }
    if (e.nativeEvent instanceof TouchEvent && e.nativeEvent.touches.length === 1) {
        const touch = e.nativeEvent.touches[0];
        touchStartPos.current = { x: touch.clientX, y: touch.clientY };
    }
  };

  const handleEnd = () => {
    isDrawing.current = false;
    touchStartPos.current = null;
    checkRevealed();
  };

  const handleMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (hasCalledOnComplete.current) return;
    
    if (e.nativeEvent instanceof TouchEvent && e.nativeEvent.touches.length === 1) {
        if (!touchStartPos.current) return;

        const touch = e.nativeEvent.touches[0];
        const dx = touch.clientX - touchStartPos.current.x;
        const dy = touch.clientY - touchStartPos.current.y;

        if (!isDrawing.current) {
            if (Math.abs(dy) > Math.abs(dx) && Math.abs(dy) > 5) {
                touchStartPos.current = null; 
                return;
            }
            if (Math.abs(dx) > 5) {
                e.preventDefault();
                isDrawing.current = true;
            }
        }
    }
    
    if (!isDrawing.current) return;
    
    if ('touches' in e.nativeEvent) {
      e.preventDefault();
    }
    
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

  return (
    <Card 
      className="w-full max-w-[320px] aspect-[2/1] mx-auto bg-card/50 backdrop-blur-sm border-primary/20 transform hover:scale-105 hover:border-primary transition-all duration-300 shadow-lg hover:shadow-primary/30 rounded-xl overflow-hidden"
    >
      <CardContent 
        className="relative w-full h-full p-0 flex items-center justify-center"
        style={{ touchAction: 'pan-y' }}
        onMouseDown={handleStart}
        onMouseMove={handleMove}
        onMouseUp={handleEnd}
        onMouseLeave={handleEnd}
        onTouchStart={handleStart}
        onTouchMove={handleMove}
        onTouchEnd={handleEnd}
      >
        <div className={cn(
          "absolute inset-0 flex flex-col items-center justify-center p-6 text-center transition-opacity duration-700",
          isRevealed ? "opacity-100" : "opacity-0"
        )}>
           <Avatar className="w-16 h-16 mb-3 border-4 border-primary/50">
            <AvatarFallback className="bg-primary/20 text-primary font-bold text-2xl">
              {getInitials(name)}
            </AvatarFallback>
          </Avatar>
          <h4 className="font-bold text-lg text-foreground">{name}</h4>
           <div className="flex justify-center text-yellow-400 my-1">
            {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
          </div>
          <p className="text-primary font-semibold text-md leading-tight">"{prize}"</p>
        </div>

        <canvas
          ref={scratchCanvasRef}
          width={W}
          height={H}
          className={cn(
            "absolute top-0 left-0 w-full h-full cursor-crosshair transition-opacity duration-700",
            isRevealed ? 'opacity-0 pointer-events-none' : 'opacity-100'
          )}
        />
      </CardContent>
    </Card>
  );
}
