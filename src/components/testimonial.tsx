import Image from 'next/image';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

type TestimonialProps = {
  name: string;
  prize: string;
  avatar: string;
  dataAiHint: string;
};

export function Testimonial({ name, prize, avatar, dataAiHint }: TestimonialProps) {
  return (
    <Card className="bg-card/50 backdrop-blur-sm border-primary/20 text-center transform hover:scale-105 hover:border-primary transition-all duration-300">
      <CardHeader className="items-center pb-2">
        <Avatar className="w-20 h-20 border-2 border-primary">
          <AvatarImage src={avatar} alt={name} data-ai-hint={dataAiHint} />
          <AvatarFallback>{name.charAt(0)}</AvatarFallback>
        </Avatar>
      </CardHeader>
      <CardContent>
        <p className="text-lg font-semibold text-primary">{name}</p>
        <p className="text-foreground/80 italic">"{prize}"</p>
      </CardContent>
    </Card>
  );
}
