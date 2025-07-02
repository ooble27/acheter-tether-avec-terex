
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Phone, Mail, DollarSign } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAdminNotifications } from '@/hooks/useAdminNotifications';
import { useAuth } from '@/contexts/AuthContext';

interface HighVolumeRequestProps {
  onBack: () => void;
  requestedAmount: string;
}

export function HighVolumeRequest({ onBack, requestedAmount }: HighVolumeRequestProps) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    amount: requestedAmount,
    purpose: '',
    additionalInfo: ''
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { sendAdminNotification } = useAdminNotifications();
  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Envoyer une notification admin pour la demande de gros volume
      await sendAdminNotification('high_volume_request', {
        userId: user?.id,
        clientInfo: formData,
        requestType: 'high_volume_purchase',
        timestamp: new Date().toISOString()
      });
      
      toast({
        title: "Demande envoyée !",
        description: "Notre équipe analysera votre demande et vous recevrez soit un appel soit un email pour discuter des conditions.",
      });

      // Réinitialiser le formulaire
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        amount: '',
        purpose: '',
        additionalInfo: ''
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible d'envoyer votre demande. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-terex-dark p-4">
      <div className="max-w-2xl md:max-w-2xl mx-auto px-2 md:px-0">
        {/* Header */}
        <div className="mb-6">
          <Button 
            variant="ghost" 
            onClick={onBack}
            className="text-terex-accent hover:bg-terex-accent/10 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour
          </Button>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
            Demande de <span className="text-terex-accent">gros volume</span>
          </h1>
          <p className="text-gray-400">
            Pour les montants supérieurs à 2 000 000 CFA, notre équipe vous accompagne personnellement
          </p>
        </div>

        <Card className="bg-terex-darker border-terex-gray">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <img 
                src="https://s2.coinmarketcap.com/static/img/coins/64x64/825.png" 
                alt="USDT" 
                className="w-5 h-5 mr-2"
              />
              Formulaire de demande spéciale
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Informations personnelles */}
              <div className="space-y-4">
                <h3 className="text-white font-medium text-lg">Informations personnelles</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-white text-sm">Prénom *</Label>
                    <Input
                      value={formData.firstName}
                      onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                      className="bg-terex-gray border-terex-gray-light text-white"
                      placeholder="Votre prénom"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-white text-sm">Nom de famille *</Label>
                    <Input
                      value={formData.lastName}
                      onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                      className="bg-terex-gray border-terex-gray-light text-white"
                      placeholder="Votre nom"
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-white text-sm">Email *</Label>
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="bg-terex-gray border-terex-gray-light text-white"
                      placeholder="votre@email.com"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-white text-sm">Téléphone *</Label>
                    <Input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      className="bg-terex-gray border-terex-gray-light text-white"
                      placeholder="+221 XX XXX XX XX"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Détails de la transaction */}
              <div className="space-y-4">
                <h3 className="text-white font-medium text-lg">Détails de votre demande</h3>
                <div className="space-y-2">
                  <Label className="text-white text-sm">Montant souhaité (CFA) *</Label>
                  <Input
                    type="number"
                    value={formData.amount}
                    onChange={(e) => setFormData({...formData, amount: e.target.value})}
                    className="bg-terex-gray border-terex-gray-light text-white"
                    placeholder="3 000 000"
                    min="2000001"
                    required
                  />
                  <p className="text-gray-400 text-xs">Minimum : 2 000 001 CFA</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-white text-sm">Objectif de la transaction *</Label>
                  <Input
                    value={formData.purpose}
                    onChange={(e) => setFormData({...formData, purpose: e.target.value})}
                    className="bg-terex-gray border-terex-gray-light text-white"
                    placeholder="Ex: Investissement, Commerce international..."
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-white text-sm">Informations complémentaires</Label>
                  <Textarea
                    value={formData.additionalInfo}
                    onChange={(e) => setFormData({...formData, additionalInfo: e.target.value})}
                    className="bg-terex-gray border-terex-gray-light text-white min-h-[100px]"
                    placeholder="Décrivez votre projet ou ajoutez des détails sur votre demande..."
                  />
                </div>
              </div>

              {/* Informations sur le processus */}
              <div className="bg-terex-gray rounded-lg p-4">
                <h4 className="text-white font-medium mb-3 flex items-center">
                  <Phone className="w-4 h-4 mr-2 text-terex-accent" />
                  Ce qui va se passer ensuite
                </h4>
                <ul className="space-y-2 text-gray-300 text-sm">
                  <li className="flex items-start">
                    <span className="text-terex-accent mr-2">•</span>
                    Notre équipe analysera votre demande dans les 24h
                  </li>
                  <li className="flex items-start">
                    <span className="text-terex-accent mr-2">•</span>
                    Vous recevrez soit un appel soit un email pour discuter des conditions
                  </li>
                  <li className="flex items-start">
                    <span className="text-terex-accent mr-2">•</span>
                    Taux préférentiels et support VIP pour les gros volumes
                  </li>
                  <li className="flex items-start">
                    <span className="text-terex-accent mr-2">•</span>
                    Processus sécurisé avec vérifications renforcées
                  </li>
                </ul>
              </div>

              <Button 
                type="submit"
                size="lg"
                className="w-full gradient-button text-white font-semibold h-12 text-lg"
                disabled={loading || !formData.firstName || !formData.lastName || !formData.email || !formData.phone || !formData.amount || !formData.purpose}
              >
                {loading ? 'Envoi en cours...' : 'Envoyer ma demande'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Contact direct */}
        <Card className="bg-terex-darker border-terex-gray mt-6">
          <CardContent className="p-6">
            <h3 className="text-white font-medium mb-4 flex items-center">
              <Mail className="w-4 h-4 mr-2 text-terex-accent" />
              Besoin d'aide immédiate ?
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-400">Email VIP</p>
                <p className="text-white">vip@terangexchange.com</p>
              </div>
              <div>
                <p className="text-gray-400">WhatsApp</p>
                <p className="text-white">+1 418-261-9091</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
