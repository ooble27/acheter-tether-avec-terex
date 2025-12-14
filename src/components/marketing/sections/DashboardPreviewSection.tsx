import dashboardPreview from '@/assets/dashboard-preview.jpeg';
import { PhoneMockup } from '../PhoneMockup';
import { Monitor, Smartphone } from 'lucide-react';

export function DashboardPreviewSection() {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-terex-dark to-terex-dark/95">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1.5 bg-terex-teal/10 border border-terex-teal/20 rounded-full text-terex-teal text-sm font-medium mb-4">
            Interface intuitive
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Un tableau de bord <span className="text-terex-teal">simple et puissant</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            Gérez vos transactions en toute simplicité. Achetez, vendez et transférez vos USDT depuis n'importe quel appareil.
          </p>
        </div>

        {/* Desktop and Mobile side by side */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center max-w-6xl mx-auto">
          {/* Desktop Version - Left */}
          <div className="relative order-1">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Monitor className="w-5 h-5 text-terex-teal" />
              <span className="text-white font-medium">Version Desktop</span>
            </div>
            
            {/* Glow effect */}
            <div className="absolute inset-0 bg-terex-teal/20 blur-3xl rounded-full scale-75 opacity-20" />
            
            {/* Desktop frame */}
            <div className="relative bg-gradient-to-b from-terex-gray/50 to-terex-gray/30 rounded-2xl p-2 border border-white/10 shadow-2xl">
              <img
                src={dashboardPreview}
                alt="Tableau de bord Terex - Interface desktop"
                className="rounded-xl w-full h-auto shadow-lg"
              />
            </div>
          </div>

          {/* Mobile Version - Right */}
          <div className="relative order-2 flex flex-col items-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Smartphone className="w-5 h-5 text-terex-accent" />
              <span className="text-white font-medium">Version Mobile</span>
            </div>
            
            {/* Glow effect */}
            <div className="absolute inset-0 bg-terex-accent/20 blur-3xl rounded-full scale-75 opacity-20" />
            
            {/* Phone mockup */}
            <div className="relative scale-90 lg:scale-100">
              <PhoneMockup />
            </div>
          </div>
        </div>

        {/* Feature badges */}
        <div className="flex flex-wrap justify-center gap-3 mt-12">
          <div className="flex items-center gap-2 bg-terex-gray/50 px-4 py-2 rounded-full border border-white/10">
            <div className="w-2 h-2 bg-green-500 rounded-full" />
            <span className="text-sm text-gray-300">Transactions en temps réel</span>
          </div>
          <div className="flex items-center gap-2 bg-terex-gray/50 px-4 py-2 rounded-full border border-white/10">
            <div className="w-2 h-2 bg-terex-teal rounded-full" />
            <span className="text-sm text-gray-300">Multi-plateforme</span>
          </div>
          <div className="flex items-center gap-2 bg-terex-gray/50 px-4 py-2 rounded-full border border-white/10">
            <div className="w-2 h-2 bg-orange-500 rounded-full" />
            <span className="text-sm text-gray-300">Expérience unifiée</span>
          </div>
        </div>
      </div>
    </section>
  );
}
