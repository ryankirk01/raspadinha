
import type { Metadata, Viewport } from 'next';
import { Poppins } from 'next/font/google';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { AntiCloningScript } from '@/components/anti-cloning-script';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '600', '700', '900']
});

export const metadata: Metadata = {
  title: 'Scratch & Win Bonanza',
  description: 'Raspe Agora e Ganhe até R$10.000!',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="dark">
      <body className={`${poppins.className} antialiased select-none`}>
        <AntiCloningScript />
        {children}
        <Toaster />
      </body>
    </html>
  );
}
