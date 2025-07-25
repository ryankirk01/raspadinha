import Image from 'next/image';
import { Particles } from '@/components/particles';
import { Countdown } from '@/components/countdown';
import { ScratchCard } from '@/components/scratch-card';
import { Testimonial } from '@/components/testimonial';
import { Button } from '@/components/ui/button';
import { CreditCardIcon, GooglePayIcon, PixIcon, SecurityIcon } from '@/components/icons';

const testimonials = [
  {
    name: 'João S.',
    prize: 'Ganhei R$500',
    avatar: 'https://placehold.co/100x100.png',
    dataAiHint: 'happy man',
  },
  {
    name: 'Maria P.',
    prize: 'Peguei R$2.000 na primeira tentativa',
    avatar: 'https://placehold.co/100x100.png',
    dataAiHint: 'surprised woman',
  },
  {
    name: 'Carlos L.',
    prize: 'Fácil e rápido, R$150 na conta!',
    avatar: 'https://placehold.co/100x100.png',
    dataAiHint: 'smiling person',
  },
];

export default function Home() {
  return (
    <div className="relative min-h-screen w-full bg-background flex flex-col items-center justify-center overflow-hidden p-4">
      <Particles className="absolute inset-0 z-0" />
      
      <main className="z-10 flex flex-col items-center justify-center w-full max-w-4xl text-center space-y-8 md:space-y-12 py-16">
        <Countdown />

        <div className="space-y-4">
          <h1 className="text-4xl md:text-6xl lg:text-8xl font-black uppercase text-glow tracking-tighter">
            Raspe Agora e Ganhe até <span className="text-primary">R$10.000!</span>
          </h1>
          <p className="text-lg md:text-xl text-foreground/80 animate-pulse">
            Raspadinhas a partir de apenas R$1 — Sorteie agora e descubra seu prêmio!
          </p>
        </div>

        <ScratchCard />

        <a href="https://example.com" target="_blank" rel="noopener noreferrer" className="w-full max-w-lg">
          <Button
            size="lg"
            className="w-full h-16 text-xl md:text-2xl font-bold bg-gradient-to-b from-yellow-400 to-amber-500 text-black rounded-lg button-glow hover:from-yellow-500 hover:to-amber-600 hover:scale-105 transition-transform duration-300 animate-shake"
          >
            ACESSAR SITE OFICIAL DA RASPADINHA 🎯
          </Button>
        </a>

        <div className="w-full pt-16">
          <h2 className="text-3xl font-bold mb-8 text-glow">O que nossos sortudos dizem</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <Testimonial key={index} {...testimonial} />
            ))}
          </div>
        </div>

        <footer className="w-full flex flex-col items-center space-y-4 pt-12 border-t border-white/10">
          <div className="flex items-center space-x-6">
            <PixIcon className="h-8 w-auto text-foreground/80 hover:text-white transition-colors" />
            <CreditCardIcon className="h-8 w-auto text-foreground/80 hover:text-white transition-colors" />
            <GooglePayIcon className="h-8 w-auto text-foreground/80 hover:text-white transition-colors" />
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
