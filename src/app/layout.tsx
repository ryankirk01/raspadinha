
'use client';

import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { AntiCloningScript } from '@/components/anti-cloning-script';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
       <head>
        <title>Scratch & Win Bonanza</title>
        <meta name="description" content="Raspe Agora e Ganhe até R$10.000!" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700;900&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased select-none">
        <AntiCloningScript />
        {children}
        <Toaster />
      </body>
    </html>
  );
}
