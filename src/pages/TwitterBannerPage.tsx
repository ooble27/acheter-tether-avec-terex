
import { TwitterBanner } from '@/components/marketing/TwitterBanner';

export function TwitterBannerPage() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
          Bannière Twitter - Terex
        </h2>
        <p className="text-gray-600 mb-6 text-center">
          Format optimisé 1500x500px pour screenshot
        </p>
        <TwitterBanner />
      </div>
    </div>
  );
}
