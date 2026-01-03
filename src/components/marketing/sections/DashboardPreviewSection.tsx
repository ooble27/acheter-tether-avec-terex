import dashboardPreview from '@/assets/dashboard-preview.jpeg';
import { PhoneMockup } from '../PhoneMockup';
import { Monitor, Smartphone } from 'lucide-react';

export function DashboardPreviewSection() {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1.5 bg-terex-accent/10 border border-terex-accent/20 rounded-full text-terex-accent text-sm font-medium mb-4">
            Interface intuitive
          </span>
          <h2 className="text-3xl md:text-4xl font-medium text-gray-900 mb-4">
            Un tableau de bord <span className="text-terex-accent">simple et puissant</span>
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto text-lg font-light">
            Gérez vos transactions en toute simplicité. Achetez, vendez et transférez vos USDT depuis n'importe quel appareil.
          </p>
        </div>

        {/* Desktop and Mobile side by side */}
        <div className="grid lg:grid-cols-[1.3fr_1fr] gap-8 lg:gap-12 items-center max-w-7xl mx-auto">
          {/* Desktop Version - Left */}
          <div className="relative order-1">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Monitor className="w-5 h-5 text-terex-accent" />
              <span className="text-gray-900 font-medium">Version Desktop</span>
            </div>
            
            {/* Desktop frame */}
            <div className="relative bg-white rounded-2xl p-3 border border-gray-100 shadow-xl">
              <img
                src={dashboardPreview}
                alt="Tableau de bord Terex - Interface desktop"
                className="rounded-xl w-full h-auto shadow-lg min-h-[400px] lg:min-h-[500px] object-cover"
              />
            </div>
          </div>

          {/* Mobile Version - Right */}
          <div className="relative order-2 flex flex-col items-center justify-center h-full">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Smartphone className="w-5 h-5 text-terex-accent" />
              <span className="text-gray-900 font-medium">Version Mobile</span>
            </div>
            
            {/* Phone mockup */}
            <div className="relative">
              <PhoneMockup />
            </div>
          </div>
        </div>

        {/* Feature badges */}
        <div className="flex flex-wrap justify-center gap-3 mt-12">
          <div className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-full border border-gray-100">
            <div className="w-2 h-2 bg-green-500 rounded-full" />
            <span className="text-sm text-gray-600">Transactions en temps réel</span>
          </div>
          <div className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-full border border-gray-100">
            <div className="w-2 h-2 bg-terex-accent rounded-full" />
            <span className="text-sm text-gray-600">Multi-plateforme</span>
          </div>
          <div className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-full border border-gray-100">
            <div className="w-2 h-2 bg-orange-500 rounded-full" />
            <span className="text-sm text-gray-600">Expérience unifiée</span>
          </div>
        </div>
      </div>
    </section>
  );
}
