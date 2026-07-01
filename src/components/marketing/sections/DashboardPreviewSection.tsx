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
    <section className="py-20 md:py-28" style={{ backgroundColor: '#1a1a1a' }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <span
            className="block text-xs font-medium uppercase tracking-widest mb-4"
            style={{ color: 'rgba(255,255,255,0.45)' }}
          >
            Interface
          </span>
          <h2
            className="font-bold text-white tracking-tight mb-4"
            style={{ fontSize: 'clamp(1.9rem, 4vw, 2.6rem)' }}
          >
            Aperçu du tableau de bord
          </h2>
          <p
            className="max-w-2xl mx-auto text-base sm:text-lg"
            style={{ color: 'rgba(255,255,255,0.55)' }}
          >
            Gérez vos transactions en toute simplicité depuis n'importe quel appareil.
          </p>
        </div>

        {isMobile ? (
          /* ===== MOBILE: Toggle between Desktop & Mobile views ===== */
          <div>
            {/* Segmented toggle */}
            <div className="flex justify-center mb-10">
              <div
                className="inline-flex rounded-2xl p-1"
                style={{ backgroundColor: '#1e1e1e', border: '1px solid rgba(255,255,255,0.07)' }}
              >
                <button
                  onClick={() => setActiveView('desktop')}
                  className="flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-medium transition-all duration-300"
                  style={
                    activeView === 'desktop'
                      ? { backgroundColor: '#ffffff', color: '#141414', fontWeight: 700 }
                      : { color: 'rgba(255,255,255,0.55)' }
                  }
                >
                  <Monitor className="w-3.5 h-3.5" />
                  Desktop
                </button>
                <button
                  onClick={() => setActiveView('mobile')}
                  className="flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-medium transition-all duration-300"
                  style={
                    activeView === 'mobile'
                      ? { backgroundColor: '#ffffff', color: '#141414', fontWeight: 700 }
                      : { color: 'rgba(255,255,255,0.55)' }
                  }
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
                <div className="scale-[0.7] origin-top">
                  <PhoneMockup />
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* ===== DESKTOP: Show both side by side ===== */
          <div className="grid lg:grid-cols-[1.3fr_1fr] gap-10 lg:gap-16 items-center max-w-6xl mx-auto">
            {/* Desktop Version */}
            <div className="relative order-1">
              <div className="flex items-center gap-2 mb-5">
                <Monitor className="w-5 h-5" style={{ color: 'rgba(255,255,255,0.55)' }} />
                <span className="text-white font-medium">Version Desktop</span>
              </div>
              <DesktopFrame large />
            </div>

            {/* Mobile Version */}
            <div className="relative order-2 flex flex-col items-center justify-center h-full">
              <div className="flex items-center gap-2 mb-5">
                <Smartphone className="w-5 h-5" style={{ color: 'rgba(255,255,255,0.55)' }} />
                <span className="text-white font-medium">Version Mobile</span>
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

/** Neutral browser-style window frame for the dashboard preview */
function DesktopFrame({ large }: { large?: boolean }) {
  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{ backgroundColor: '#1e1e1e', border: '1px solid rgba(255,255,255,0.07)' }}
    >
      {/* Window title bar */}
      <div
        className="flex items-center gap-2 px-4 py-3"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}
      >
        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: 'rgba(255,255,255,0.15)' }} />
        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: 'rgba(255,255,255,0.15)' }} />
        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: 'rgba(255,255,255,0.15)' }} />
        <div
          className="mx-auto rounded-md px-3 py-1 text-[11px]"
          style={{ backgroundColor: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.45)' }}
        >
          app.terex
        </div>
      </div>
      <img
        src={dashboardPreview}
        alt="Tableau de bord Terex - Desktop"
        className={`${large ? 'min-h-[400px] lg:min-h-[500px]' : ''} w-full h-auto object-cover`}
      />
    </div>
  );
}
