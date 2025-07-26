
"use client";

import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Star } from 'lucide-react';

type TestimonialProps = {
  name: string;
  prize: string;
};

export function TestimonialScratchCard({ name, prize }: TestimonialProps) {
  
  const getInitials = (name: string) => {
    const names = name.split(' ');
    let initials = names[0].substring(0, 1).toUpperCase();
    if (names.length > 1) {
      initials += names[names.length - 1].substring(0, 1).toUpperCase();
    }
    return initials;
  };

  return (
    <Card 
      className="w-full max-w-[320px] mx-auto bg-card/50 backdrop-blur-sm border-primary/20 transform hover:scale-105 hover:border-primary transition-all duration-300 shadow-lg hover:shadow-primary/30 rounded-xl overflow-hidden"
    >
      <CardContent 
        className="relative w-full h-full p-6 flex flex-col items-center justify-center text-center"
      >
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
      </CardContent>
    </Card>
  );
}
