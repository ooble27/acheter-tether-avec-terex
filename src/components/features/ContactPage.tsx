
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useContactMessages } from '@/hooks/useContactMessages';
import { ArrowLeft, Phone, Mail, MapPin, Clock, Send } from 'lucide-react';

interface ContactPageProps {
  onBack: () => void;
}

export function ContactPage({ onBack }: ContactPageProps) {
  const { sendMessage, loading } = useContactMessages();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
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
    
    if (!formData.name.trim() || !formData.email.trim() || !formData.subject.trim() || !formData.message.trim()) {
      return;
    }

    const messageData = {
      subject: formData.subject,
      message: `Nom: ${formData.name}\nEmail: ${formData.email}\nTéléphone: ${formData.phone || 'Non renseigné'}\n\nMessage:\n${formData.message}`,
      user_email: formData.email,
      user_name: formData.name,
      user_phone: formData.phone || undefined
    };

    const result = await sendMessage(messageData);

    if (!result.error) {
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
    }
  };

  return (
    <div className="min-h-screen bg-terex-dark p-4 md:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-6 md:mb-8">
        <Button 
          onClick={onBack}
          variant="ghost" 
          className="text-gray-400 hover:text-white mb-4 p-0"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour
        </Button>
        
        <div className="bg-gradient-to-br from-terex-darker/95 to-terex-dark/95 border border-white/10 rounded-2xl p-6 md:p-8 shadow-2xl backdrop-blur-sm">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-terex-accent to-terex-accent/70 rounded-2xl flex items-center justify-center shadow-lg">
              <Mail className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">Contactez-nous</h1>
              <p className="text-gray-300 text-lg">Notre équipe est là pour vous aider</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Formulaire de contact */}
        <Card className="bg-gradient-to-br from-terex-darker to-terex-dark border border-terex-gray/30 shadow-2xl">
          <CardHeader>
            <CardTitle className="text-white text-2xl">Envoyez-nous un message</CardTitle>
            <CardDescription className="text-gray-400">
              Remplissez le formulaire ci-dessous et nous vous répondrons rapidement
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-gray-300 font-medium mb-2 block">Nom complet *</label>
                  <Input
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Votre nom"
                    className="bg-terex-darker/50 border-terex-gray/30 text-white focus:border-terex-accent"
                    required
                  />
                </div>
                <div>
                  <label className="text-gray-300 font-medium mb-2 block">Email *</label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="votre@email.com"
                    className="bg-terex-darker/50 border-terex-gray/30 text-white focus:border-terex-accent"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-gray-300 font-medium mb-2 block">Téléphone</label>
                <Input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="+33 6 12 34 56 78"
                  className="bg-terex-darker/50 border-terex-gray/30 text-white focus:border-terex-accent"
                />
              </div>

              <div>
                <label className="text-gray-300 font-medium mb-2 block">Sujet *</label>
                <Input
                  value={formData.subject}
                  onChange={(e) => handleInputChange('subject', e.target.value)}
                  placeholder="Sujet de votre demande"
                  className="bg-terex-darker/50 border-terex-gray/30 text-white focus:border-terex-accent"
                  required
                />
              </div>

              <div>
                <label className="text-gray-300 font-medium mb-2 block">Message *</label>
                <Textarea
                  value={formData.message}
                  onChange={(e) => handleInputChange('message', e.target.value)}
                  placeholder="Décrivez votre demande en détail..."
                  className="bg-terex-darker/50 border-terex-gray/30 text-white min-h-[150px] resize-none focus:border-terex-accent"
                  required
                />
              </div>

              <Button 
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-terex-accent to-terex-accent/80 hover:from-terex-accent/90 hover:to-terex-accent/70 text-white transition-all duration-200 h-12"
              >
                <Send className="w-4 h-4 mr-2" />
                {loading ? 'Envoi en cours...' : 'Envoyer le message'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Informations de contact */}
        <div className="space-y-6">
          <Card className="bg-gradient-to-br from-terex-darker to-terex-dark border border-terex-gray/30 shadow-2xl">
            <CardHeader>
              <CardTitle className="text-white text-2xl">Nos coordonnées</CardTitle>
              <CardDescription className="text-gray-400">
                Plusieurs moyens de nous contacter
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-terex-accent/20 rounded-xl flex items-center justify-center">
                  <Mail className="w-6 h-6 text-terex-accent" />
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-1">Email</h3>
                  <p className="text-gray-400">support@terex.africa</p>
                  <p className="text-gray-400">contact@terex.africa</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-terex-accent/20 rounded-xl flex items-center justify-center">
                  <Phone className="w-6 h-6 text-terex-accent" />
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-1">Téléphone</h3>
                  <p className="text-gray-400">+225 07 XX XX XX XX</p>
                  <p className="text-gray-400">+33 6 XX XX XX XX</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-terex-accent/20 rounded-xl flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-terex-accent" />
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-1">Adresse</h3>
                  <p className="text-gray-400">Abidjan, Côte d'Ivoire</p>
                  <p className="text-gray-400">Paris, France</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-terex-accent/20 rounded-xl flex items-center justify-center">
                  <Clock className="w-6 h-6 text-terex-accent" />
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-1">Horaires</h3>
                  <p className="text-gray-400">Lun - Ven : 8h - 18h GMT</p>
                  <p className="text-gray-400">Sam : 9h - 16h GMT</p>
                  <p className="text-gray-400">Support 24/7 disponible</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-900/20 to-terex-dark border border-green-500/30 shadow-2xl">
            <CardContent className="p-6">
              <h3 className="text-green-400 font-semibold mb-2">Support prioritaire</h3>
              <p className="text-gray-300 text-sm">
                Les utilisateurs vérifiés KYC bénéficient d'un support prioritaire avec des temps de réponse réduits.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
