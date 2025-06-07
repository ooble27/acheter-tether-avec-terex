
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useContactMessages } from '@/hooks/useContactMessages';
import { useUserProfile } from '@/hooks/useUserProfile';
import { MessageCircle, Send } from 'lucide-react';

interface ContactCardProps {
  user: { email: string; name: string } | null;
}

export function ContactCard({ user }: ContactCardProps) {
  const { sendMessage, loading } = useContactMessages();
  const { profile } = useUserProfile();
  
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

    const result = await sendMessage({
      subject: formData.subject,
      message: formData.message,
      user_email: user?.email || '',
      user_name: profile?.full_name || user?.name || '',
      user_phone: profile?.phone || ''
    });

    if (!result.error) {
      setFormData({
        subject: '',
        message: ''
      });
    }
  };

  return (
    <Card className="bg-gradient-to-br from-terex-darker to-terex-dark border-terex-gray shadow-2xl">
      <CardHeader className="bg-gradient-to-r from-terex-accent/10 to-transparent border-b border-terex-gray/50">
        <div className="flex items-center">
          <MessageCircle className="w-5 h-5 mr-2 text-terex-accent" />
          <div>
            <CardTitle className="text-white">Contactez-nous</CardTitle>
            <CardDescription className="text-gray-400">
              Envoyez-nous un message directement depuis votre profil
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="subject" className="text-gray-300">Sujet</Label>
            <Input
              id="subject"
              value={formData.subject}
              onChange={(e) => handleInputChange('subject', e.target.value)}
              placeholder="Objet de votre message"
              className="bg-terex-gray border-terex-gray text-white mt-1"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="message" className="text-gray-300">Message</Label>
            <Textarea
              id="message"
              value={formData.message}
              onChange={(e) => handleInputChange('message', e.target.value)}
              placeholder="Décrivez votre demande ou vos besoins..."
              className="bg-terex-gray border-terex-gray text-white mt-1 min-h-[120px] resize-none"
              required
            />
          </div>

          <div className="bg-terex-gray/30 rounded-xl p-4">
            <p className="text-gray-400 text-sm mb-2">Informations de contact :</p>
            <p className="text-white text-sm"><strong>Email :</strong> {user?.email}</p>
            <p className="text-white text-sm"><strong>Nom :</strong> {profile?.full_name || user?.name || 'Non renseigné'}</p>
            {profile?.phone && (
              <p className="text-white text-sm"><strong>Téléphone :</strong> {profile.phone}</p>
            )}
          </div>

          <Button 
            type="submit"
            disabled={loading || !formData.subject.trim() || !formData.message.trim()}
            className="w-full bg-terex-accent hover:bg-terex-accent/80 text-white"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Envoi en cours...
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Envoyer le message
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
