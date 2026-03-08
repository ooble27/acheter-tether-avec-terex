import { useState } from 'react';
import dashboardPreview from '@/assets/dashboard-preview.jpeg';
import { PhoneMockup } from '../PhoneMockup';
import { Monitor, Smartphone } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

// Preload the desktop image immediately
const preloadImg = new Image();
preloadImg.src = dashboardPreview;

export function DashboardPreviewSection() {
  const isMobile = useIsMobile();
  const [activeView, setActiveView] = useState<'desktop' | 'mobile'>('desktop');

  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-terex-dark to-terex-dark/95">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8 md:mb-12">
          <span className="inline-block px-4 py-1.5 bg-terex-teal/10 border border-terex-teal/20 rounded-full text-terex-teal text-sm font-medium mb-4">
            Interface intuitive
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-2 md:mb-4">
            Aperçu du <span className="text-terex-teal">tableau de bord</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg hidden md:block">
            Gérez vos transactions en toute simplicité depuis n'importe quel appareil.
          </p>
        </div>

        {isMobile ? (
          /* ===== MOBILE: Toggle between Desktop & Mobile views ===== */
          <div>
            {/* Segmented toggle */}
            <div className="flex justify-center mb-8">
              <div className="inline-flex bg-terex-darker/80 border border-terex-gray/20 rounded-2xl p-1 backdrop-blur-sm">
                <button
                  onClick={() => setActiveView('desktop')}
                  className={`flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-medium transition-all duration-300 ${
                    activeView === 'desktop'
                      ? 'bg-terex-accent text-black shadow-md'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Monitor className="w-3.5 h-3.5" />
                  Desktop
                </button>
                <button
                  onClick={() => setActiveView('mobile')}
                  className={`flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-medium transition-all duration-300 ${
                    activeView === 'mobile'
                      ? 'bg-terex-accent text-black shadow-md'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  Mobile
                </button>
              </div>
            </div>

            {/* Content — fixed height container to prevent gap changes */}
            <div className="flex justify-center">
              <div className={`w-full max-w-lg ${activeView === 'desktop' ? 'block' : 'hidden'}`}>
                <DesktopFrame />
              </div>
              <div className={`${activeView === 'mobile' ? 'block' : 'hidden'}`}>
                <PhoneMockup />
              </div>
            </div>
          </div>
        ) : (
          /* ===== DESKTOP: Show both side by side ===== */
          <div className="grid lg:grid-cols-[1.3fr_1fr] gap-8 lg:gap-12 items-center max-w-7xl mx-auto">
            {/* Desktop Version */}
            <div className="relative order-1">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Monitor className="w-5 h-5 text-terex-teal" />
                <span className="text-foreground font-medium">Version Desktop</span>
              </div>
              <div className="absolute inset-0 bg-terex-teal/20 blur-3xl rounded-full scale-75 opacity-20" />
              <DesktopFrame large />
            </div>

            {/* Mobile Version */}
            <div className="relative order-2 flex flex-col items-center justify-center h-full">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Smartphone className="w-5 h-5 text-terex-accent" />
                <span className="text-foreground font-medium">Version Mobile</span>
              </div>
              <div className="relative scale-[0.85] lg:scale-100 origin-top">
                <PhoneMockup />
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

/** iMac-style desktop frame — clean, slightly brighter borders */
function DesktopFrame({ large }: { large?: boolean }) {
  return (
    <div className="relative">
      <div className={`bg-gradient-to-b from-terex-gray/60 to-terex-gray/35 ${large ? 'rounded-2xl p-3' : 'rounded-xl p-1.5'} border border-white/20 shadow-2xl`}>
        {/* Camera */}
        <div className="absolute top-1.5 left-1/2 -translate-x-1/2 z-10">
          <div className={`${large ? 'w-2.5 h-2.5' : 'w-2 h-2'} bg-terex-gray/60 rounded-full`} />
        </div>
        <img
          src={dashboardPreview}
          alt="Tableau de bord Terex - Desktop"
          className={`${large ? 'rounded-xl min-h-[400px] lg:min-h-[500px]' : 'rounded-lg'} w-full h-auto shadow-lg object-cover`}
        />
      </div>
      {/* Stand */}
      <div className="flex justify-center mt-0">
        <div className={`${large ? 'w-32 h-4' : 'w-24 h-3'} bg-gradient-to-b from-terex-gray/40 to-terex-gray/15 rounded-b-xl border-x border-b border-white/15`} />
      </div>
      <div className="flex justify-center -mt-0.5">
        <div className={`${large ? 'w-48 h-2' : 'w-36 h-1.5'} bg-terex-gray/25 rounded-full border border-white/10`} />
      </div>
    </div>
  );
}
