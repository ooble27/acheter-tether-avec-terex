import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Video } from 'lucide-react';

interface VideoGuideProps {
  title: string;
  videoUrl: string;
  description: string;
  onBack: () => void;
}

export const VideoGuide = ({ title, videoUrl, description, onBack }: VideoGuideProps) => {
  // Extraire l'ID YouTube si c'est une URL YouTube
  const getYouTubeEmbedUrl = (url: string) => {
    // Si c'est déjà une URL embed, la retourner telle quelle
    if (url.includes('youtube.com/embed/')) {
      return url;
    }
    
    // Extraire l'ID de différents formats d'URL YouTube
    let videoId = '';
    if (url.includes('youtube.com/watch?v=')) {
      videoId = url.split('v=')[1]?.split('&')[0] || '';
    } else if (url.includes('youtu.be/')) {
      videoId = url.split('youtu.be/')[1]?.split('?')[0] || '';
    }
    
    return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
  };

  const embedUrl = getYouTubeEmbedUrl(videoUrl);

  return (
    <div className="min-h-screen bg-terex-dark py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <Button
          onClick={onBack}
          variant="ghost"
          className="mb-6 text-terex-accent hover:text-terex-accent/80 hover:bg-terex-accent/10"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour aux guides
        </Button>

        <Card className="bg-gradient-to-br from-terex-darker to-terex-gray/30 border-terex-accent/20">
          <CardHeader>
            <div className="flex items-center space-x-3 mb-2">
              <div className="w-10 h-10 bg-terex-accent/20 rounded-lg flex items-center justify-center">
                <Video className="w-5 h-5 text-terex-accent" />
              </div>
              <CardTitle className="text-white text-2xl">{title}</CardTitle>
            </div>
            <p className="text-gray-300">{description}</p>
          </CardHeader>
          
          <CardContent>
            <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
              <iframe
                src={embedUrl}
                title={title}
                className="absolute top-0 left-0 w-full h-full rounded-lg"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>

            <div className="mt-8 p-6 bg-terex-darker/50 rounded-lg border border-terex-accent/10">
              <h3 className="text-white font-semibold mb-3 flex items-center">
                <Video className="w-5 h-5 mr-2 text-terex-accent" />
                À propos de cette vidéo
              </h3>
              <p className="text-gray-300 leading-relaxed">
                Cette vidéo vous guide pas à pas pour {title.toLowerCase()}. 
                Prenez le temps de suivre chaque étape et n'hésitez pas à mettre en pause 
                pour pratiquer en parallèle sur votre compte Terex.
              </p>
            </div>

            <div className="mt-6 p-4 bg-terex-accent/10 rounded-lg border border-terex-accent/20">
              <p className="text-terex-accent text-sm">
                💡 <strong>Conseil :</strong> Vous pouvez activer les sous-titres et ajuster la vitesse de lecture 
                selon vos préférences dans les paramètres de la vidéo.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
