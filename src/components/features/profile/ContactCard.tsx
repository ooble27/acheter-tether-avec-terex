
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useUserProfile } from '@/hooks/useUserProfile';
import { MessageCircle, Send, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ContactCardProps {
  user: { email: string; name: string } | null;
}

export function ContactCard({ user }: ContactCardProps) {
  const { profile } = useUserProfile();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    subject: '',
    message: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.subject.trim() || !formData.message.trim()) {
      return;
    }

    // Temporairement désactivé - ne pas envoyer le message
    toast({
      title: "Service temporairement indisponible",
      description: "L'envoi de messages est temporairement désactivé. Veuillez réessayer plus tard.",
      variant: "destructive",
    });

    console.log('Formulaire de contact désactivé temporairement');
    console.log('Données du message:', {
      subject: formData.subject,
      message: formData.message,
      user_email: user?.email,
      user_name: profile?.full_name || user?.name,
      user_phone: profile?.phone
    });
  };

  return (
    <Card className="bg-gradient-to-br from-terex-darker to-terex-dark border border-terex-gray/30 shadow-2xl backdrop-blur-sm">
      <CardHeader className="bg-gradient-to-r from-terex-accent/10 to-transparent border-b border-terex-gray/30 rounded-t-xl">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-gradient-to-br from-terex-accent to-terex-accent/70 rounded-xl flex items-center justify-center mr-3">
            <MessageCircle className="w-5 h-5 text-white" />
          </div>
          <div>
            <CardTitle className="text-white">Contactez-nous</CardTitle>
            <CardDescription className="text-gray-400">
              Envoyez-nous un message directement depuis votre profil
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        {/* Alerte temporaire */}
        <div className="flex items-center space-x-3 p-4 bg-orange-500/10 border border-orange-500/20 rounded-xl mb-6">
          <AlertTriangle className="w-5 h-5 text-orange-400 flex-shrink-0" />
          <p className="text-orange-300 text-sm">
            Service temporairement indisponible. L'envoi de messages sera bientôt rétabli.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="subject" className="text-gray-300 font-medium">Sujet</Label>
            <Input
              id="subject"
              value={formData.subject}
              onChange={(e) => handleInputChange('subject', e.target.value)}
              placeholder="Objet de votre message"
              className="bg-terex-gray/50 border-terex-gray/30 text-white mt-2 focus:border-terex-accent transition-colors"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="message" className="text-gray-300 font-medium">Message</Label>
            <Textarea
              id="message"
              value={formData.message}
              onChange={(e) => handleInputChange('message', e.target.value)}
              placeholder="Décrivez votre demande ou vos besoins..."
              className="bg-terex-gray/50 border-terex-gray/30 text-white mt-2 min-h-[120px] resize-none focus:border-terex-accent transition-colors"
              required
            />
          </div>

          <div className="bg-gradient-to-br from-terex-gray/40 to-terex-gray/20 rounded-xl p-4 border border-terex-gray/20">
            <p className="text-gray-400 text-sm mb-2 font-medium">Informations de contact :</p>
            <p className="text-white text-sm"><strong>Email :</strong> {user?.email}</p>
            <p className="text-white text-sm"><strong>Nom :</strong> {profile?.full_name || user?.name || 'Non renseigné'}</p>
            {profile?.phone && (
              <p className="text-white text-sm"><strong>Téléphone :</strong> {profile.phone}</p>
            )}
          </div>

          <Button 
            type="submit"
            disabled={!formData.subject.trim() || !formData.message.trim()}
            className="w-full bg-gradient-to-r from-terex-accent to-terex-accent/80 hover:from-terex-accent/90 hover:to-terex-accent/70 text-white transition-all duration-200 disabled:opacity-50"
          >
            <Send className="w-4 h-4 mr-2" />
            Envoyer le message
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
