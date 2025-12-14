import dashboardPreview from '@/assets/dashboard-preview.jpeg';

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
            Gérez vos transactions crypto en toute simplicité. Achetez, vendez et transférez vos USDT en quelques clics.
          </p>
        </div>

        <div className="relative max-w-4xl mx-auto">
          {/* Glow effect behind the image */}
          <div className="absolute inset-0 bg-terex-teal/20 blur-3xl rounded-full scale-75 opacity-30" />
          
          {/* Dashboard image with frame effect */}
          <div className="relative">
            <div className="bg-gradient-to-b from-terex-gray/50 to-terex-gray/30 rounded-3xl p-2 md:p-3 border border-white/10 shadow-2xl">
              <img
                src={dashboardPreview}
                alt="Tableau de bord Terex - Interface de gestion des transactions USDT"
                className="rounded-2xl w-full h-auto shadow-lg"
              />
            </div>
            
            {/* Decorative elements */}
            <div className="absolute -top-4 -left-4 w-8 h-8 bg-terex-teal/30 rounded-full blur-xl" />
            <div className="absolute -bottom-4 -right-4 w-12 h-12 bg-terex-teal/20 rounded-full blur-xl" />
          </div>

          {/* Feature badges */}
          <div className="flex flex-wrap justify-center gap-3 mt-8">
            <div className="flex items-center gap-2 bg-terex-gray/50 px-4 py-2 rounded-full border border-white/10">
              <div className="w-2 h-2 bg-green-500 rounded-full" />
              <span className="text-sm text-gray-300">Transactions en temps réel</span>
            </div>
            <div className="flex items-center gap-2 bg-terex-gray/50 px-4 py-2 rounded-full border border-white/10">
              <div className="w-2 h-2 bg-terex-teal rounded-full" />
              <span className="text-sm text-gray-300">Interface mobile-first</span>
            </div>
            <div className="flex items-center gap-2 bg-terex-gray/50 px-4 py-2 rounded-full border border-white/10">
              <div className="w-2 h-2 bg-orange-500 rounded-full" />
              <span className="text-sm text-gray-300">Suivi des opérations</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
