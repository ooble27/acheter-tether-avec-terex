
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Copy, Share2, Eye } from 'lucide-react';
import { useState } from 'react';
import { SocialMediaPost } from './assets/SocialMediaPost';
import { StoryTemplate } from './assets/StoryTemplate';
import { YouTubeThumbnail } from './assets/YouTubeThumbnail';
import { InfographicTemplate } from './assets/InfographicTemplate';
import { AdCopyGenerator } from './assets/AdCopyGenerator';

export function MarketingAssets() {
  const [selectedAsset, setSelectedAsset] = useState<string>('social-post');

  const assets = [
    { id: 'social-post', title: 'Posts Facebook/Instagram', component: SocialMediaPost },
    { id: 'story', title: 'Stories Instagram/Snapchat', component: StoryTemplate },
    { id: 'youtube', title: 'Miniatures YouTube', component: YouTubeThumbnail },
    { id: 'infographic', title: 'Infographies', component: InfographicTemplate },
    { id: 'ad-copy', title: 'Textes Publicitaires', component: AdCopyGenerator }
  ];

  const SelectedComponent = assets.find(asset => asset.id === selectedAsset)?.component || SocialMediaPost;

  return (
    <div className="min-h-screen bg-terex-dark p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-4">
            Contenus Marketing <span className="text-terex-accent">Terex</span>
          </h1>
          <p className="text-gray-400">
            Créez et téléchargez vos visuels publicitaires pour toutes les plateformes
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Menu de sélection */}
          <div className="lg:col-span-1">
            <Card className="bg-terex-darker border-terex-gray">
              <CardHeader>
                <CardTitle className="text-white text-lg">Types de contenus</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {assets.map((asset) => (
                  <Button
                    key={asset.id}
                    variant={selectedAsset === asset.id ? "default" : "ghost"}
                    className={`w-full justify-start ${
                      selectedAsset === asset.id 
                        ? 'bg-terex-accent text-black' 
                        : 'text-gray-400 hover:text-white hover:bg-terex-gray/30'
                    }`}
                    onClick={() => setSelectedAsset(asset.id)}
                  >
                    {asset.title}
                  </Button>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Zone de prévisualisation */}
          <div className="lg:col-span-3">
            <Card className="bg-terex-darker border-terex-gray">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-white">
                  {assets.find(asset => asset.id === selectedAsset)?.title}
                </CardTitle>
                <div className="flex space-x-2">
                  <Button size="sm" variant="outline" className="border-terex-accent/30 text-terex-accent">
                    <Eye className="w-4 h-4 mr-2" />
                    Prévisualiser
                  </Button>
                  <Button size="sm" className="bg-terex-accent text-black hover:bg-terex-accent/80">
                    <Download className="w-4 h-4 mr-2" />
                    Télécharger
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <SelectedComponent />
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Instructions d'utilisation */}
        <Card className="mt-6 bg-blue-500/10 border-blue-500/20">
          <CardContent className="p-6">
            <h3 className="text-white font-semibold mb-3 flex items-center">
              <Share2 className="w-5 h-5 mr-2 text-blue-400" />
              Comment utiliser ces contenus
            </h3>
            <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-300">
              <div>
                <h4 className="font-medium text-white mb-2">Pour les réseaux sociaux :</h4>
                <ul className="space-y-1">
                  <li>• Téléchargez les visuels en haute résolution</li>
                  <li>• Copiez les textes dans vos campagnes</li>
                  <li>• Adaptez les messages à votre audience</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-white mb-2">Conseils de publication :</h4>
                <ul className="space-y-1">
                  <li>• Postez aux heures de forte affluence</li>
                  <li>• Utilisez des hashtags pertinents</li>
                  <li>• Engagez avec votre communauté</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
