
'use client';

import { useState } from 'react';
import { Particles } from '@/components/particles';
import { Countdown } from '@/components/countdown';
import { ScratchCard, ScratchProgress } from '@/components/scratch-card';
import { TestimonialScratchCard } from '@/components/testimonial';
import { Button } from '@/components/ui/button';
import { CreditCardIcon, GooglePayIcon, PixIcon, SecurityIcon } from '@/components/icons';
import { cn } from '@/lib/utils';
import { Rocket, Star } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

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
  {
    name: 'Ana B.',
    prize: 'Que sorte, R$750 logo de cara!',
  },
  {
    name: 'Pedro M.',
    prize: 'R$300! Já quero raspar de novo.',
  },
  {
    name: 'Sofia C.',
    prize: 'Tirei R$1000, sensacional!',
  }
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
      <Particles className="absolute inset-0 z-0" quantity={isScratchComplete ? 200 : 100} />
      
      <main className="z-10 flex flex-col items-center justify-center w-full max-w-5xl text-center space-y-8 md:space-y-12 py-16">
        <div className="animate-fadeIn" style={{ animationDelay: '0.2s' }}>
          <Countdown />
        </div>

        <div className="space-y-4 animate-fadeIn" style={{ animationDelay: '0.4s' }}>
          <h1 className="text-4xl md:text-6xl lg:text-8xl font-black uppercase tracking-tighter animate-text-glow-pulse">
            SUA SORTE ESTÁ SELADA
          </h1>
          <p className="text-lg md:text-xl text-foreground/90">
            Raspe e ganhe até <span className="font-bold text-primary">R$10.000!</span>
          </p>
        </div>

        <div className="w-full max-w-sm flex flex-col items-center gap-4">
           <div className={cn("animate-float w-full flex flex-col items-center gap-4 transition-all duration-500", isScratchComplete && "scale-105")}>
            <ScratchCard 
              onComplete={handleScratchComplete}
              onUpdate={handleScratchUpdate} 
            />
            <ScratchProgress progress={scratchProgress} />
          </div>
          
          <div className={cn("w-full transition-all duration-500 flex flex-col items-center text-center", isScratchComplete ? "opacity-0 scale-90 h-0 pointer-events-none" : "opacity-100 scale-100")}>
            <div className="relative w-full overflow-hidden bg-gradient-to-r from-primary via-yellow-400 to-amber-600 py-2 my-2 rounded-md shadow-lg">
                <div className="flex animate-marquee whitespace-nowrap">
                  {[...Array(2)].map((_, i) => (
                    <div key={i} className="flex items-center mx-4">
                      <span className="text-md font-black text-black uppercase">Raspe para ganhar</span>
                      <Star className="w-4 h-4 mx-2 text-black fill-current" />
                      <span className="text-md font-black text-black uppercase">Sorte instantânea</span>
                       <Star className="w-4 h-4 mx-2 text-black fill-current" />
                    </div>
                  ))}
                </div>
              </div>
            <p className="font-bold text-lg mt-2 text-glow">Toque no cartão para revelar seu prêmio!</p>
          </div>
        </div>

        <div className={cn("w-full max-w-lg transition-all duration-500 flex flex-col items-center gap-4", isScratchComplete ? "opacity-100 scale-100" : "opacity-0 scale-90 h-0 pointer-events-none")}>
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
                "w-full h-16 text-xl md:text-2xl font-bold bg-gradient-to-b from-yellow-400 to-amber-600 text-black rounded-lg hover:from-yellow-500 hover:to-amber-700 hover:scale-105 transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-50",
                 isScratchComplete && "animate-pulse button-glow"
              )}
              style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.2)' }}
            >
              GARANTIR MEU PRÊMIO AGORA 🎯
            </Button>
          </a>
            <Alert className="max-w-md text-left bg-primary/10 border-primary/30">
              <Rocket className="h-5 w-5 text-primary" />
              <AlertTitle className="font-bold text-primary">ÚLTIMO PASSO PARA O SAQUE!</AlertTitle>
              <AlertDescription className="text-foreground/80">
                Realize seu cadastro e faça seu primeiro depósito para liberar o prêmio.
              </AlertDescription>
            </Alert>
             <div className="relative w-full max-w-md overflow-hidden bg-gradient-to-r from-green-400 via-emerald-500 to-green-600 py-2 mt-2 rounded-md shadow-lg">
                <div className="flex animate-marquee whitespace-nowrap">
                  {[...Array(2)].map((_, i) => (
                    <div key={i} className="flex items-center mx-4">
                      <span className="text-md font-black text-black uppercase">PRÊMIO LIBERADO COM SUCESSO!</span>
                      <Star className="w-4 h-4 mx-2 text-black fill-current" />
                    </div>
                  ))}
                </div>
              </div>
        </div>
        
        {isScratchComplete && (
          <div className="w-full pt-16 space-y-12 transition-all duration-700 opacity-100 scale-100 animate-fadeIn" style={{ animationDelay: '0.5s' }}>
            <h2 className="text-3xl font-bold mb-8 text-glow">O que nossos sortudos dizem</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <TestimonialScratchCard 
                  key={index} 
                  {...testimonial} 
                />
              ))}
            </div>
          </div>
        )}

        <div className="relative w-full overflow-hidden bg-gradient-to-r from-primary via-yellow-400 to-amber-600 py-3 rounded-md shadow-lg mt-16 animate-fadeIn" style={{ animationDelay: '1.2s' }}>
          <div className="flex animate-marquee whitespace-nowrap">
              {[...Array(4)].map((_, i) => (
                  <div key={i} className="flex items-center mx-4">
                      <span className="text-lg font-black text-black uppercase tracking-wider">PRÊMIOS INSTANTÂNEOS</span>
                      <Star className="w-5 h-5 mx-3 text-black fill-current" />
                      <span className="text-lg font-black text-black uppercase tracking-wider">PAGAMENTO RÁPIDO</span>
                       <Star className="w-5 h-5 mx-3 text-black fill-current" />
                       <span className="text-lg font-black text-black uppercase tracking-wider">JOGUE AGORA</span>
                       <Star className="w-5 h-5 mx-3 text-black fill-current" />
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
