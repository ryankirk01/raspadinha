
'use client';

import { useState } from 'react';
import { Particles } from '@/components/particles';
import { Countdown } from '@/components/countdown';
import { ScratchCard, ScratchProgress } from '@/components/scratch-card';
import { Testimonial } from '@/components/testimonial';
import { Button } from '@/components/ui/button';
import { CreditCardIcon, GooglePayIcon, PixIcon, SecurityIcon } from '@/components/icons';
import { cn } from '@/lib/utils';

const testimonials = [
  {
    name: 'João S.',
    prize: 'Ganhei R$500',
  },
  {
    name: 'Maria P.',
    prize: 'Peguei R$2.000 na primeira tentativa',
  },
  {
    name: 'Carlos L.',
    prize: 'Fácil e rápido, R$150 na conta!',
  },
];

export default function Home() {
  const [isScratchComplete, setIsScratchComplete] = useState(false);
  const [scratchProgress, setScratchProgress] = useState(0);

  const handleScratchComplete = () => {
    setIsScratchComplete(true);
    if (window.navigator.vibrate) {
      window.navigator.vibrate([200, 50, 200]);
    }
  }

  const handleScratchUpdate = (progress: number) => {
    setScratchProgress(progress);
     if (window.navigator.vibrate && progress > 85 && progress < 95) {
      window.navigator.vibrate(50);
    }
  }

  return (
    <div className="relative min-h-screen w-full bg-background flex flex-col items-center justify-center overflow-hidden p-4">
      <Particles className="absolute inset-0 z-0" quantity={isScratchComplete ? 500 : 150} />
      
      <main className="z-10 flex flex-col items-center justify-center w-full max-w-4xl text-center space-y-8 md:space-y-12 py-16">
        <div className="animate-fadeIn" style={{ animationDelay: '0.2s' }}>
          <Countdown />
        </div>

        <div className="space-y-4 animate-fadeIn" style={{ animationDelay: '0.4s' }}>
          <h1 className="text-4xl md:text-6xl lg:text-8xl font-black uppercase tracking-tighter title-shine">
             Raspe e Ganhe até <span className="text-primary text-glow">R$10.000!</span>
          </h1>
          <p className="text-lg md:text-xl text-foreground/80">
            Sua sorte está a um toque de distância. Raspe agora!
          </p>
        </div>

        <div className="w-full max-w-sm flex flex-col items-center gap-4">
           <div className={cn("animate-float w-full flex flex-col items-center gap-4 transition-all duration-500", isScratchComplete && "scale-110")}>
            <ScratchCard 
              onComplete={handleScratchComplete}
              onUpdate={handleScratchUpdate} 
            />
             <ScratchProgress progress={scratchProgress} />
          </div>
        </div>

        <div className={cn("w-full max-w-lg transition-all duration-500", isScratchComplete ? "opacity-100 scale-100" : "opacity-50 scale-90")}>
          <a 
            href="https://raspadinha-gold.com/?code=RHY4R1BS5S" 
            target="_blank" 
            rel="noopener noreferrer" 
            className={cn("w-full", !isScratchComplete && "pointer-events-none cursor-not-allowed")}
            onClick={(e) => {
              if (!isScratchComplete) e.preventDefault();
            }}
          >
            <Button
              size="lg"
              disabled={!isScratchComplete}
              className={cn(
                "w-full h-16 text-xl md:text-2xl font-bold bg-gradient-to-b from-primary to-amber-600 text-primary-foreground rounded-lg button-glow hover:from-yellow-500 hover:to-amber-700 hover:scale-105 transition-all duration-300 disabled:button-glow-off disabled:cursor-not-allowed disabled:opacity-50",
                isScratchComplete && "animate-pulse-strong"
              )}
            >
              GARANTIR MEU PRÊMIO AGORA 🎯
            </Button>
          </a>
        </div>

        <div className="w-full pt-16">
          <h2 className="text-3xl font-bold mb-8 text-glow animate-fadeIn" style={{ animationDelay: '0.8s' }}>O que nossos sortudos dizem</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="animate-fadeIn" style={{ animationDelay: `${1 + index * 0.2}s` }}>
                <Testimonial {...testimonial} />
              </div>
            ))}
          </div>
        </div>

        <footer className="w-full flex flex-col items-center space-y-4 pt-12 border-t border-white/10 animate-fadeIn" style={{ animationDelay: '1.6s' }}>
          <div className="flex items-center space-x-6">
            <PixIcon className="h-8 w-auto text-foreground/80 hover:text-primary transition-colors" />
            <CreditCardIcon className="h-8 w-auto text-foreground/80 hover:text-primary transition-colors" />
            <GooglePayIcon className="h-8 w-auto text-foreground/80 hover:text-primary transition-colors" />
          </div>
          <div className="flex items-center space-x-2 text-sm text-green-400">
            <SecurityIcon className="h-5 w-5" />
            <span>Pagamento 100% Seguro</span>
          </div>
        </footer>
      </main>
    </div>
  );
}
