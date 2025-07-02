
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useContactMessages } from '@/hooks/useContactMessages';
import { useAuth } from '@/contexts/AuthContext';
import { Mail, Phone, MessageSquare } from 'lucide-react';

export function ContactForm() {
  const { user } = useAuth();
  const { sendMessage, loading } = useContactMessages();
  const [formData, setFormData] = useState({
    subject: '',
    message: '',
    user_name: '',
    user_email: user?.email || '',
    user_phone: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await sendMessage(formData);
    
    if (!result.error) {
      setFormData({
        subject: '',
        message: '',
        user_name: '',
        user_email: user?.email || '',
        user_phone: ''
      });
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="bg-terex-darker border-terex-accent/30">
        <CardHeader>
          <CardTitle className="text-terex-accent flex items-center">
            <MessageSquare className="w-5 h-5 mr-2" />
            Contactez-nous
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Nom complet *
                </label>
                <Input
                  required
                  value={formData.user_name}
                  onChange={(e) => setFormData({...formData, user_name: e.target.value})}
                  className="bg-terex-dark border-terex-accent/30 text-white"
                  placeholder="Votre nom"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Email *
                </label>
                <Input
                  type="email"
                  required
                  value={formData.user_email}
                  onChange={(e) => setFormData({...formData, user_email: e.target.value})}
                  className="bg-terex-dark border-terex-accent/30 text-white"
                  placeholder="votre@email.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Téléphone
              </label>
              <Input
                value={formData.user_phone}
                onChange={(e) => setFormData({...formData, user_phone: e.target.value})}
                className="bg-terex-dark border-terex-accent/30 text-white"
                placeholder="+33 6 12 34 56 78"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Sujet *
              </label>
              <Input
                required
                value={formData.subject}
                onChange={(e) => setFormData({...formData, subject: e.target.value})}
                className="bg-terex-dark border-terex-accent/30 text-white"
                placeholder="Question sur un produit, commande, etc."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Message *
              </label>
              <Textarea
                required
                value={formData.message}
                onChange={(e) => setFormData({...formData, message: e.target.value})}
                rows={5}
                className="bg-terex-dark border-terex-accent/30 text-white resize-none"
                placeholder="Décrivez votre demande en détail..."
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-terex-accent text-black hover:bg-terex-accent/90 font-semibold"
            >
              {loading ? 'Envoi en cours...' : 'Envoyer le message'}
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-terex-accent/20">
            <h3 className="text-white font-semibold mb-3">Autres moyens de contact</h3>
            <div className="space-y-2 text-sm text-gray-300">
              <div className="flex items-center">
                <Mail className="w-4 h-4 mr-2 text-terex-accent" />
                support@terex.sn
              </div>
              <div className="flex items-center">
                <Phone className="w-4 h-4 mr-2 text-terex-accent" />
                +221 33 123 45 67
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
