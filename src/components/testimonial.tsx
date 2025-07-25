
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Star } from 'lucide-react';

type TestimonialProps = {
  name: string;
  prize: string;
};

export function Testimonial({ name, prize }: TestimonialProps) {
  return (
    <Card className="bg-card/50 backdrop-blur-sm border-primary/20 text-center transform hover:scale-105 hover:border-primary transition-all duration-300 shadow-lg hover:shadow-primary/30">
      <CardHeader className="items-center pb-2">
        <div className="flex text-primary">
          <Star className="w-5 h-5 fill-current" />
          <Star className="w-5 h-5 fill-current" />
          <Star className="w-5 h-5 fill-current" />
          <Star className="w-5 h-5 fill-current" />
          <Star className="w-5 h-5 fill-current" />
        </div>
      </CardHeader>
      <CardContent className="pt-2">
        <p className="text-lg font-semibold text-primary">{name}</p>
        <p className="text-foreground/80 italic">"{prize}"</p>
      </CardContent>
    </Card>
  );
}
