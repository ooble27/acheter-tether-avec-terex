
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface SpiceCTAProps {
  user?: { email: string; name: string } | null;
}

export function SpiceCTA({ user }: SpiceCTAProps) {
  const navigate = useNavigate();

  return (
    <section className="py-24 sm:py-32 lg:py-40 bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Large typography */}
        <h2 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl text-white italic leading-none mb-8">
          Prêt ?
        </h2>
        
        <p className="text-gray-400 text-lg sm:text-xl mb-12 max-w-xl mx-auto">
          {user 
            ? 'Continuez à gérer vos transactions avec Terex'
            : 'Commencez votre aventure avec Terex aujourd\'hui'
          }
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={() => navigate(user ? '/dashboard' : '/auth')}
            className="bg-white text-black hover:bg-gray-100 rounded-full px-10 py-6 text-base font-medium"
          >
            {user ? 'Aller au Dashboard' : 'Commencer gratuitement'}
          </Button>
          <Button
            onClick={() => navigate('/about')}
            variant="ghost"
            className="text-white hover:bg-white/5 rounded-full px-10 py-6 text-base"
          >
            En savoir plus
          </Button>
        </div>
      </div>
    </section>
  );
}
