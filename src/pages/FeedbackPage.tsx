import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Star, MessageSquare, Send, ArrowLeft, TrendingUp, Lightbulb } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function FeedbackPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [category, setCategory] = useState<'bug' | 'suggestion' | 'appreciation'>('suggestion');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast({
        title: "Erreur",
        description: "Vous devez être connecté pour envoyer un avis",
        variant: "destructive",
      });
      return;
    }

    if (rating === 0 || !message.trim()) {
      toast({
        title: "Erreur",
        description: "Veuillez donner une note et un message",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase
        .from('contact_messages')
        .insert({
          user_id: user.id,
          user_email: user.email,
          user_name: user.user_metadata?.name || user.email,
          subject: `Avis & Suggestion - ${category}`,
          message: `Note: ${rating}/5\n\nCatégorie: ${category}\n\n${message}`,
          status: 'new'
        });

      if (error) throw error;

      toast({
        title: "Merci pour votre retour !",
        description: "Votre avis a été envoyé avec succès",
        className: "bg-green-600 text-white",
      });

      setRating(0);
      setMessage('');
      setCategory('suggestion');
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible d'envoyer votre avis",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-terex-dark px-4 md:p-6 lg:p-8 py-3">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button
            onClick={() => navigate('/dashboard')}
            variant="outline"
            size="sm"
            className="border-terex-gray text-white hover:bg-terex-gray/20"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-2xl md:text-3xl font-light text-white mb-1">Avis & Suggestions</h1>
            <p className="text-sm text-gray-400 font-light">Votre avis compte pour nous</p>
          </div>
        </div>

        {/* Formulaire principal */}
        <Card className="bg-terex-darker border-terex-gray">
          <CardHeader>
            <CardTitle className="text-white font-light flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-terex-accent" />
              Donnez-nous votre avis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Catégorie */}
              <div className="space-y-3">
                <Label className="text-gray-400 font-light">Type de retour</Label>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => setCategory('bug')}
                    className={`p-4 rounded-lg border transition-all ${
                      category === 'bug'
                        ? 'bg-red-500/10 border-red-500/20 text-red-400'
                        : 'bg-terex-dark border-terex-gray text-gray-400 hover:bg-terex-gray/20'
                    }`}
                  >
                    <TrendingUp className="w-5 h-5 mx-auto mb-2" />
                    <span className="text-xs font-light">Problème</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setCategory('suggestion')}
                    className={`p-4 rounded-lg border transition-all ${
                      category === 'suggestion'
                        ? 'bg-blue-500/10 border-blue-500/20 text-blue-400'
                        : 'bg-terex-dark border-terex-gray text-gray-400 hover:bg-terex-gray/20'
                    }`}
                  >
                    <Lightbulb className="w-5 h-5 mx-auto mb-2" />
                    <span className="text-xs font-light">Suggestion</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setCategory('appreciation')}
                    className={`p-4 rounded-lg border transition-all ${
                      category === 'appreciation'
                        ? 'bg-green-500/10 border-green-500/20 text-green-400'
                        : 'bg-terex-dark border-terex-gray text-gray-400 hover:bg-terex-gray/20'
                    }`}
                  >
                    <Star className="w-5 h-5 mx-auto mb-2" />
                    <span className="text-xs font-light">Appréciation</span>
                  </button>
                </div>
              </div>

              {/* Note */}
              <div className="space-y-3">
                <Label className="text-gray-400 font-light">Votre note</Label>
                <div className="flex gap-2 justify-center py-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="transition-transform hover:scale-110"
                    >
                      <Star
                        className={`w-10 h-10 ${
                          star <= (hoverRating || rating)
                            ? 'fill-terex-accent text-terex-accent'
                            : 'text-gray-600'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Message */}
              <div className="space-y-2">
                <Label className="text-gray-400 font-light">Votre message</Label>
                <Textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Partagez-nous votre expérience, vos suggestions ou vos remarques..."
                  className="bg-terex-dark border-terex-gray text-white min-h-[150px] resize-none"
                  required
                />
              </div>

              {/* Submit */}
              <Button
                type="submit"
                disabled={loading || rating === 0 || !message.trim()}
                className="w-full bg-terex-accent hover:bg-terex-accent/90 text-black"
              >
                <Send className="w-4 h-4 mr-2" />
                {loading ? 'Envoi...' : 'Envoyer mon avis'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Info */}
        <Card className="bg-terex-darker border-terex-gray">
          <CardContent className="p-4 md:p-6">
            <div className="flex items-start gap-3">
              <MessageSquare className="w-5 h-5 text-terex-accent flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-white font-light mb-2">Pourquoi votre avis est important</h3>
                <ul className="text-gray-400 text-sm font-light space-y-2">
                  <li>• Nous aide à améliorer nos services</li>
                  <li>• Permet de corriger rapidement les problèmes</li>
                  <li>• Guide le développement de nouvelles fonctionnalités</li>
                  <li>• Renforce la communauté Terex</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
