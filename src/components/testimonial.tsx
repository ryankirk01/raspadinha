
"use client";

import { useRef, useState, useEffect, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

type TestimonialProps = {
  name: string;
  prize: string;
  mainScratchCompleted: boolean;
};

export function TestimonialScratchCard({ name, prize, mainScratchCompleted }: TestimonialProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const W = 280, H = 140;
  const isDrawing = useRef(false);
  const touchStartPos = useRef<{ x: number, y: number } | null>(null);
  const touchMovePos = useRef<{ x: number, y: number } | null>(null);


  const initCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const gradient = ctx.createLinearGradient(0, 0, W, H);
    gradient.addColorStop(0, '#d4af37'); 
    gradient.addColorStop(0.5, '#ffd700');
    gradient.addColorStop(1, '#b8860b');

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, W, H);
    
    ctx.font = 'bold 14px Poppins';
    ctx.fillStyle = 'rgba(0,0,0,0.4)';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('RASPE AQUI', W / 2, H / 2);

    ctx.globalCompositeOperation = 'destination-out';
  }, []);

  useEffect(() => {
    initCanvas();
  }, [initCanvas]);

  const scratch = (ctx: CanvasRenderingContext2D, x: number, y: number) => {
    ctx.beginPath();
    ctx.arc(x, y, 35, 0, 2 * Math.PI, true);
    ctx.fill();
  };

  const checkRevealed = useCallback(() => {
    if (isRevealed) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
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
    if (percentage > 50) {
      setIsRevealed(true);
    }
  }, [isRevealed]);

 const handleStart = (e: React.MouseEvent | React.TouchEvent) => {
    isDrawing.current = false;
    touchMovePos.current = null;
    if (e.nativeEvent instanceof TouchEvent && e.nativeEvent.touches.length === 1) {
        const touch = e.nativeEvent.touches[0];
        touchStartPos.current = { x: touch.clientX, y: touch.clientY };
    } else if (e.nativeEvent instanceof MouseEvent) {
        isDrawing.current = true;
    }
  };
  
  const handleEnd = () => {
    if (isDrawing.current) {
        checkRevealed();
    }
    isDrawing.current = false;
    touchStartPos.current = null;
    touchMovePos.current = null;
  };
  
  const handleMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (isRevealed) return;

    let currentX: number, currentY: number;

    if (e.nativeEvent instanceof TouchEvent) {
        if (e.nativeEvent.touches.length !== 1) return;
        if (!touchStartPos.current) return;
        
        const touch = e.nativeEvent.touches[0];
        currentX = touch.clientX;
        currentY = touch.clientY;

        if (!isDrawing.current && !touchMovePos.current) {
          touchMovePos.current = { x: currentX, y: currentY };
        }
        
        if (!isDrawing.current) {
            const dx = currentX - touchStartPos.current.x;
            const dy = currentY - touchStartPos.current.y;
            
            if (Math.abs(dy) > 5 && Math.abs(dy) > Math.abs(dx)) {
                touchStartPos.current = null;
                return;
            }
            if (Math.abs(dx) > 5) {
                isDrawing.current = true;
            }
        }

    } else if (e.nativeEvent instanceof MouseEvent) {
        if (!isDrawing.current) return;
        currentX = e.nativeEvent.clientX;
        currentY = e.nativeEvent.clientY;
    } else {
        return;
    }

    if (!isDrawing.current) return;
  
    if ('touches' in e.nativeEvent) {
      e.preventDefault();
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = currentX - rect.left;
    const y = currentY - rect.top;
  
    scratch(ctx, x, y);
  };

  return (
    <Card 
      className="w-[280px] h-[140px] mx-auto bg-card/50 backdrop-blur-sm border-primary/20 transform hover:scale-105 hover:border-primary transition-all duration-300 shadow-lg hover:shadow-primary/30 touch-none"
    >
      <CardContent 
        className="relative w-full h-full p-0 flex items-center justify-center text-center"
        onMouseDown={handleStart}
        onMouseMove={handleMove}
        onMouseUp={handleEnd}
        onMouseLeave={handleEnd}
        onTouchStart={handleStart}
        onTouchMove={handleMove}
        onTouchEnd={handleEnd}
      >
        <div className={cn(
          "absolute inset-0 flex flex-col items-center justify-center transition-opacity duration-500",
          isRevealed ? "opacity-100" : "opacity-0"
        )}>
          <div className="flex justify-center text-yellow-400 mb-1">
            {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
          </div>
          <p className="text-lg font-bold text-primary">{name}</p>
          <p className="text-foreground/80 italic text-sm">"{prize}"</p>
        </div>

        <canvas
          ref={canvasRef}
          width={W}
          height={H}
          className={cn(
            "absolute top-0 left-0 w-full h-full cursor-crosshair rounded-md transition-opacity duration-700",
            isRevealed ? 'opacity-0 pointer-events-none' : 'opacity-100'
          )}
        />
      </CardContent>
    </Card>
  );
}
