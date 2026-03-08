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

            {/* Content — both rendered, toggle visibility for instant switch */}
            <div className="flex justify-center">
              <div className={`w-full max-w-lg transition-opacity duration-300 ${activeView === 'desktop' ? 'block' : 'hidden'}`}>
                <DesktopFrame />
              </div>
              <div className={`transition-opacity duration-300 ${activeView === 'mobile' ? 'block' : 'hidden'}`}>
                <div className="scale-[0.65] origin-top">
                  <PhoneMockup />
                </div>
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

/** iMac-style desktop frame with clearer borders */
function DesktopFrame({ large }: { large?: boolean }) {
  return (
    <div className="relative">
      <div className={`bg-gradient-to-b from-[hsl(0,0%,35%)] to-[hsl(0,0%,22%)] ${large ? 'rounded-2xl p-3' : 'rounded-xl p-1.5'} border-2 border-[hsl(0,0%,45%)] shadow-2xl`}>
        {/* Top bar with camera and dots */}
        <div className={`flex items-center ${large ? 'mb-2 px-3' : 'mb-1 px-2'}`}>
          <div className="flex gap-1.5">
            <div className={`${large ? 'w-3 h-3' : 'w-2 h-2'} rounded-full bg-red-500/80`} />
            <div className={`${large ? 'w-3 h-3' : 'w-2 h-2'} rounded-full bg-yellow-500/80`} />
            <div className={`${large ? 'w-3 h-3' : 'w-2 h-2'} rounded-full bg-green-500/80`} />
          </div>
          <div className="flex-1 flex justify-center">
            <div className={`${large ? 'w-2.5 h-2.5' : 'w-2 h-2'} bg-[hsl(0,0%,50%)] rounded-full`} />
          </div>
          <div className="flex gap-1.5 opacity-0">
            <div className={`${large ? 'w-3 h-3' : 'w-2 h-2'} rounded-full`} />
            <div className={`${large ? 'w-3 h-3' : 'w-2 h-2'} rounded-full`} />
            <div className={`${large ? 'w-3 h-3' : 'w-2 h-2'} rounded-full`} />
          </div>
        </div>
        <img
          src={dashboardPreview}
          alt="Tableau de bord Terex - Desktop"
          className={`${large ? 'rounded-xl min-h-[400px] lg:min-h-[500px]' : 'rounded-lg'} w-full h-auto shadow-lg object-cover`}
        />
      </div>
      {/* Stand */}
      <div className="flex justify-center mt-0">
        <div className={`${large ? 'w-32 h-5' : 'w-24 h-3'} bg-gradient-to-b from-[hsl(0,0%,35%)] to-[hsl(0,0%,25%)] rounded-b-xl border-x-2 border-b-2 border-[hsl(0,0%,45%)]`} />
      </div>
      <div className="flex justify-center -mt-0.5">
        <div className={`${large ? 'w-48 h-2.5' : 'w-36 h-1.5'} bg-[hsl(0,0%,30%)] rounded-full border border-[hsl(0,0%,40%)]`} />
      </div>
    </div>
  );
}
