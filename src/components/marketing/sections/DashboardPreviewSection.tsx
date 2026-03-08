import { useState } from 'react';
import dashboardPreview from '@/assets/dashboard-preview.jpeg';
import { PhoneMockup } from '../PhoneMockup';
import { Monitor, Smartphone } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { ScreenSlides } from '../ScreenSlides';

export function DashboardPreviewSection() {
  const isMobile = useIsMobile();
  const [activeView, setActiveView] = useState<'desktop' | 'mobile'>('desktop');

  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-terex-dark to-terex-dark/95">
      <div className="container mx-auto px-4">
        {/* Header — hidden on mobile per user request */}
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
            {/* Toggle buttons */}
            <div className="flex justify-center gap-2 mb-6">
              <button
                onClick={() => setActiveView('desktop')}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
                  activeView === 'desktop'
                    ? 'bg-terex-accent text-black shadow-lg shadow-terex-accent/20'
                    : 'bg-terex-darker/60 text-muted-foreground border border-terex-gray/30 hover:border-terex-accent/30'
                }`}
              >
                <Monitor className="w-4 h-4" />
                Desktop
              </button>
              <button
                onClick={() => setActiveView('mobile')}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
                  activeView === 'mobile'
                    ? 'bg-terex-accent text-black shadow-lg shadow-terex-accent/20'
                    : 'bg-terex-darker/60 text-muted-foreground border border-terex-gray/30 hover:border-terex-accent/30'
                }`}
              >
                <Smartphone className="w-4 h-4" />
                Mobile
              </button>
            </div>

            {/* Content area */}
            <div className="flex justify-center">
              {activeView === 'desktop' ? (
                <div className="relative w-full max-w-lg">
                  {/* Desktop mockup frame */}
                  <div className="relative bg-gradient-to-b from-terex-gray/40 to-terex-gray/20 rounded-xl p-1.5 border border-white/10 shadow-2xl">
                    {/* Camera dot */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-0 z-10">
                      <div className="w-2 h-2 bg-terex-gray/60 rounded-full mt-1" />
                    </div>
                    <img
                      src={dashboardPreview}
                      alt="Tableau de bord Terex - Desktop"
                      className="rounded-lg w-full h-auto shadow-lg object-cover"
                    />
                  </div>
                  {/* Stand */}
                  <div className="flex justify-center mt-0">
                    <div className="w-24 h-3 bg-gradient-to-b from-terex-gray/30 to-terex-gray/10 rounded-b-lg" />
                  </div>
                  <div className="flex justify-center -mt-0.5">
                    <div className="w-36 h-1.5 bg-terex-gray/20 rounded-full" />
                  </div>
                </div>
              ) : (
                <div className="relative">
                  {/* Realistic iPhone mockup */}
                  <RealisticPhoneMockup />
                </div>
              )}
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
              {/* iMac-style frame */}
              <div className="relative">
                <div className="bg-gradient-to-b from-terex-gray/50 to-terex-gray/30 rounded-2xl p-3 border border-white/10 shadow-2xl">
                  {/* Camera */}
                  <div className="absolute top-1.5 left-1/2 -translate-x-1/2 z-10">
                    <div className="w-2.5 h-2.5 bg-terex-gray/50 rounded-full" />
                  </div>
                  <img
                    src={dashboardPreview}
                    alt="Tableau de bord Terex - Desktop"
                    className="rounded-xl w-full h-auto shadow-lg min-h-[400px] lg:min-h-[500px] object-cover"
                  />
                </div>
                {/* Stand */}
                <div className="flex justify-center mt-0">
                  <div className="w-32 h-4 bg-gradient-to-b from-terex-gray/30 to-terex-gray/10 rounded-b-xl" />
                </div>
                <div className="flex justify-center -mt-0.5">
                  <div className="w-48 h-2 bg-terex-gray/20 rounded-full" />
                </div>
              </div>
            </div>

            {/* Mobile Version */}
            <div className="relative order-2 flex flex-col items-center justify-center h-full">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Smartphone className="w-5 h-5 text-terex-accent" />
                <span className="text-foreground font-medium">Version Mobile</span>
              </div>
              <div className="relative scale-[0.85] lg:scale-100 origin-top">
                <RealisticPhoneMockup />
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

/** A more realistic iPhone-style mockup wrapping the PhoneMockup content */
function RealisticPhoneMockup() {
  return (
    <div className="relative mx-auto">
      {/* Outer titanium frame */}
      <div className="relative w-[280px] h-[580px] rounded-[3.2rem] bg-gradient-to-b from-[hsl(var(--terex-gray)/0.6)] to-[hsl(var(--terex-gray)/0.3)] p-[3px] shadow-[0_25px_60px_-12px_rgba(0,0,0,0.6)]">
        {/* Inner black bezel */}
        <div className="w-full h-full bg-black rounded-[3rem] p-[2px] relative overflow-hidden">
          {/* Dynamic Island */}
          <div className="absolute top-3 left-1/2 -translate-x-1/2 w-[90px] h-[28px] bg-black rounded-full z-30 flex items-center justify-center">
            <div className="w-[10px] h-[10px] rounded-full bg-[hsl(var(--terex-gray)/0.15)] mr-2" />
            <div className="w-[6px] h-[6px] rounded-full bg-[hsl(var(--terex-gray)/0.1)]" />
          </div>

          {/* Screen */}
          <div className="w-full h-full rounded-[2.8rem] overflow-hidden bg-terex-dark">
            {/* Status bar */}
            <div className="h-12 flex items-end justify-between px-8 pb-1 text-[11px] text-white font-semibold">
              <span>9:41</span>
              <div className="flex items-center gap-1">
                <svg className="w-4 h-3" viewBox="0 0 16 12" fill="white"><path d="M1 9h2v3H1zM5 6h2v6H5zM9 3h2v9H9zM13 0h2v12h-2z"/></svg>
                <svg className="w-4 h-3" viewBox="0 0 16 12" fill="white"><path d="M8 2C5 2 2.4 3.6 1 6c1.4 2.4 4 4 7 4s5.6-1.6 7-4c-1.4-2.4-4-4-7-4zm0 6.5c-1.4 0-2.5-1.1-2.5-2.5S6.6 3.5 8 3.5s2.5 1.1 2.5 2.5S9.4 8.5 8 8.5z"/></svg>
                <div className="w-[22px] h-[10px] border border-white rounded-[3px] relative">
                  <div className="absolute inset-[1px] right-[3px] bg-white rounded-[1px]" />
                  <div className="absolute right-[-3px] top-1/2 -translate-y-1/2 w-[2px] h-[5px] bg-white rounded-r-sm" />
                </div>
              </div>
            </div>

            {/* App content */}
            <div className="h-[calc(100%-48px)] overflow-hidden">
              <ScreenSlides currentSlide={0} deviceType="mobile" />
            </div>
          </div>

          {/* Home indicator */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-[120px] h-[4px] bg-white/60 rounded-full z-30" />
        </div>
      </div>

      {/* Side buttons */}
      <div className="absolute left-[-2px] top-[120px] w-[3px] h-[28px] bg-[hsl(var(--terex-gray)/0.4)] rounded-l-sm" />
      <div className="absolute left-[-2px] top-[170px] w-[3px] h-[50px] bg-[hsl(var(--terex-gray)/0.4)] rounded-l-sm" />
      <div className="absolute left-[-2px] top-[230px] w-[3px] h-[50px] bg-[hsl(var(--terex-gray)/0.4)] rounded-l-sm" />
      <div className="absolute right-[-2px] top-[170px] w-[3px] h-[60px] bg-[hsl(var(--terex-gray)/0.4)] rounded-r-sm" />
    </div>
  );
}
