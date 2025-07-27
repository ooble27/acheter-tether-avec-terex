
import { TwitterBanner } from '@/components/marketing/TwitterBanner';

export function TwitterBannerPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-8">
      <div className="bg-white/10 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-white/20">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">
            Bannière Twitter - Terex
          </h2>
          <p className="text-gray-300 text-lg">
            Format optimisé 1500x500px pour screenshot
          </p>
          <div className="mt-4 text-sm text-gray-400">
            Dimension: 1500 × 500 pixels (Ratio 3:1)
          </div>
        </div>
        
        <div className="border-2 border-dashed border-gray-600 rounded-lg p-4 bg-gray-800/50">
          <TwitterBanner />
        </div>
        
        <div className="mt-6 text-center">
          <p className="text-gray-400 text-sm">
            💡 Conseil: Utilisez l'outil capture d'écran pour sauvegarder uniquement la bannière
          </p>
        </div>
      </div>
    </div>
  );
}
