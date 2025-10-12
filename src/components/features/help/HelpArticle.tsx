import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChevronLeft, CheckCircle2 } from 'lucide-react';

interface HelpArticleProps {
  article: {
    title: string;
    category: string;
    content: {
      intro: string;
      steps?: Array<{
        title: string;
        description: string;
      }>;
      tips?: string[];
      conclusion?: string;
    };
  };
  onBack: () => void;
}

export const HelpArticle = ({ article, onBack }: HelpArticleProps) => {
  return (
    <div className="min-h-screen bg-terex-dark py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Button
          onClick={onBack}
          variant="ghost"
          className="mb-6 text-terex-accent hover:text-terex-accent/80 hover:bg-terex-accent/10"
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          Retour aux articles
        </Button>

        <Card className="bg-gradient-to-br from-terex-darker to-terex-gray/30 border-terex-accent/20">
          <CardHeader>
            <div className="mb-2">
              <span className="text-terex-accent text-sm font-medium">{article.category}</span>
            </div>
            <CardTitle className="text-white text-3xl">{article.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[600px] pr-4">
              <div className="space-y-6 text-gray-300">
                {/* Introduction */}
                <p className="text-lg leading-relaxed">{article.content.intro}</p>

                {/* Steps */}
                {article.content.steps && article.content.steps.length > 0 && (
                  <div className="space-y-4 mt-8">
                    <h3 className="text-xl font-semibold text-white mb-4">Étapes à suivre:</h3>
                    {article.content.steps.map((step, index) => (
                      <div key={index} className="bg-terex-dark/50 rounded-lg p-6 border border-terex-accent/10">
                        <div className="flex items-start space-x-4">
                          <div className="flex-shrink-0 w-8 h-8 bg-terex-accent/20 rounded-full flex items-center justify-center">
                            <span className="text-terex-accent font-bold">{index + 1}</span>
                          </div>
                          <div className="flex-1">
                            <h4 className="text-white font-semibold mb-2">{step.title}</h4>
                            <p className="text-gray-300 leading-relaxed">{step.description}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Tips */}
                {article.content.tips && article.content.tips.length > 0 && (
                  <div className="bg-terex-accent/10 rounded-lg p-6 border border-terex-accent/20 mt-8">
                    <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                      <CheckCircle2 className="w-5 h-5 mr-2 text-terex-accent" />
                      Conseils utiles:
                    </h3>
                    <ul className="space-y-2">
                      {article.content.tips.map((tip, index) => (
                        <li key={index} className="flex items-start space-x-3">
                          <span className="text-terex-accent mt-1">•</span>
                          <span>{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Conclusion */}
                {article.content.conclusion && (
                  <div className="mt-8 pt-6 border-t border-terex-accent/20">
                    <p className="text-lg leading-relaxed">{article.content.conclusion}</p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
