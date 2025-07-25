
"use client";

import { useRef, useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

type TestimonialProps = {
  name: string;
  prize: string;
};

export function Testimonial({ name, prize }: TestimonialProps) {
  return (
    <Card className="bg-card/50 backdrop-blur-sm border-primary/20 text-center transform hover:scale-105 hover:border-primary transition-all duration-300 shadow-lg hover:shadow-primary/30">
      <CardContent className="pt-6">
        <div className="flex justify-center text-primary mb-2">
          {[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 fill-current" />)}
        </div>
        <p className="text-lg font-semibold text-primary">{name}</p>
        <p className="text-foreground/80 italic">"{prize}"</p>
      </CardContent>
    </Card>
  );
}

export function TestimonialScratchCard({ name, prize }: TestimonialProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const W = 280, H = 140;

  const initCanvas = () => {
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
  };

  useEffect(() => {
    initCanvas();
  }, []);

  const scratch = (ctx: CanvasRenderingContext2D, x: number, y: number) => {
    ctx.beginPath();
    ctx.arc(x, y, 20, 0, 2 * Math.PI, true);
    ctx.fill();
  };

  const checkRevealed = () => {
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
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas || isRevealed) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    scratch(ctx, x, y);
    checkRevealed();
  };
  
  const handleTouchMove = (e: React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas || isRevealed) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const rect = canvas.getBoundingClientRect();
    const touch = e.touches[0];
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;

    scratch(ctx, x, y);
    checkRevealed();
  };

  return (
    <Card 
      className="w-full max-w-[280px] h-[140px] mx-auto bg-card/50 backdrop-blur-sm border-primary/20 transform hover:scale-105 hover:border-primary transition-all duration-300 shadow-lg hover:shadow-primary/30"
      onMouseMove={handleMouseMove}
      onTouchMove={handleTouchMove}
      onTouchEnd={checkRevealed}
    >
      <CardContent className="relative w-full h-full p-0 flex items-center justify-center text-center">
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
