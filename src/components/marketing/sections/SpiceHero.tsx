
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
import dashboardPreview from '@/assets/dashboard-preview.jpeg';

interface SpiceHeroProps {
  user?: { email: string; name: string } | null;
  onShowDashboard?: () => void;
}

export function SpiceHero({ user, onShowDashboard }: SpiceHeroProps) {
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const handleGetStarted = () => {
    if (user && onShowDashboard) {
      onShowDashboard();
    } else {
      navigate('/auth');
    }
  };

  return (
    <section className="relative min-h-screen bg-black overflow-hidden pt-20 sm:pt-24">
      {/* Diagonal stripes background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute h-[1px] bg-white origin-left"
              style={{
                width: '200%',
                top: `${i * 8}%`,
                left: '-50%',
                transform: 'rotate(-15deg)',
              }}
            />
          ))}
        </div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center min-h-[calc(100vh-200px)]">
          {/* Left content */}
          <div className="text-center lg:text-left order-2 lg:order-1">
            {/* Badge */}
            <div className="inline-flex items-center bg-white/5 border border-white/10 rounded-full px-4 py-1.5 mb-6">
              <span className="text-gray-400 text-xs sm:text-sm">Terex • Transferts Simplifiés</span>
            </div>

            {/* Main headline */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-white leading-[1.1] mb-6">
              Échangez,
              <br />
              transférez,
              <br />
              <span className="bg-gradient-to-r from-pink-500 via-purple-400 to-pink-500 bg-clip-text text-transparent">
                prospérez
              </span>
            </h1>

            {/* Description */}
            <p className="text-gray-400 text-base sm:text-lg lg:text-xl mb-8 max-w-lg mx-auto lg:mx-0 leading-relaxed">
              La plateforme de nouvelle génération pour acheter et vendre des USDT et transférer de l'argent vers l'Afrique en quelques minutes.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button
                onClick={handleGetStarted}
                className="bg-white text-black hover:bg-gray-100 rounded-full px-8 py-6 text-base font-medium"
              >
                {user ? 'Aller au Dashboard' : 'Commencer maintenant'}
              </Button>
              <Button
                onClick={() => {
                  const element = document.getElementById('features');
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                variant="ghost"
                className="text-white hover:bg-white/5 rounded-full px-8 py-6 text-base"
              >
                Découvrir
              </Button>
            </div>
          </div>

          {/* Right content - Device mockup */}
          <div className="order-1 lg:order-2 flex justify-center lg:justify-end">
            <div className="relative">
              {/* Laptop mockup frame */}
              <div className="relative">
                {/* Laptop screen bezel */}
                <div className="bg-gradient-to-b from-gray-800 to-gray-900 rounded-t-xl p-2 sm:p-3">
                  {/* Camera notch */}
                  <div className="absolute top-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-gray-700 flex items-center justify-center">
                    <div className="w-1 h-1 rounded-full bg-gray-600" />
                  </div>
                  
                  {/* Screen content */}
                  <div className="relative bg-black rounded-lg overflow-hidden aspect-[16/10] w-[280px] sm:w-[400px] lg:w-[500px]">
                    <img 
                      src={dashboardPreview}
                      alt="Terex Dashboard"
                      className="w-full h-full object-cover object-top"
                    />
                    
                    {/* Overlay UI elements */}
                    <div className="absolute top-3 left-3 flex items-center space-x-2">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-pink-500 to-purple-500 p-[1px]">
                        <div className="w-full h-full rounded-full bg-black/80 flex items-center justify-center">
                          <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-br from-pink-500 to-purple-500" />
                        </div>
                      </div>
                      <div className="flex space-x-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-white/40" />
                        <div className="w-1.5 h-1.5 rounded-full bg-white/40" />
                        <div className="w-1.5 h-1.5 rounded-full bg-white/40" />
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Laptop base */}
                <div className="bg-gradient-to-b from-gray-800 to-gray-900 h-3 sm:h-4 rounded-b-lg mx-auto w-[95%]" />
                <div className="bg-gray-800 h-1 rounded-b-xl mx-auto w-[60%]" />
              </div>

              {/* Floating phone mockup */}
              {!isMobile && (
                <div className="absolute -right-8 bottom-8 transform rotate-6">
                  <div className="bg-gray-900 rounded-[2rem] p-2 shadow-2xl">
                    <div className="bg-black rounded-[1.5rem] w-32 h-64 overflow-hidden relative">
                      {/* Phone notch */}
                      <div className="absolute top-2 left-1/2 -translate-x-1/2 w-12 h-4 bg-black rounded-full z-10" />
                      
                      {/* Phone content */}
                      <div className="h-full bg-gradient-to-b from-terex-darker to-black p-3 pt-6">
                        <div className="space-y-2">
                          <div className="bg-white/10 rounded-lg p-2">
                            <div className="text-[8px] text-gray-400">Balance</div>
                            <div className="text-sm text-white font-medium">1,250 USDT</div>
                          </div>
                          <div className="grid grid-cols-2 gap-1">
                            <div className="bg-terex-accent/20 rounded-lg p-1.5 text-center">
                              <div className="text-[6px] text-terex-accent">Acheter</div>
                            </div>
                            <div className="bg-white/10 rounded-lg p-1.5 text-center">
                              <div className="text-[6px] text-white">Vendre</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
