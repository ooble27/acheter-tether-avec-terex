
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useTransactions } from '@/contexts/TransactionContext';
import { KYCAlert } from './KYCAlert';
import { KYCPage } from './KYCPage';
import { TransactionHistory } from './TransactionHistory';
import { Share2, MessageCircle } from 'lucide-react';

interface ProfileProps {
  user: { email: string; name: string } | null;
  onLogout: () => void;
}

export function Profile({ user, onLogout }: ProfileProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [showKYC, setShowKYC] = useState(false);
  const { toast } = useToast();
  const { profile, loading, updateProfile } = useUserProfile();
  const { transactions } = useTransactions();

  const [formData, setFormData] = useState({
    name: profile?.full_name || user?.name || '',
    phone: profile?.phone || '',
    country: profile?.country || '',
    language: profile?.language || 'fr',
    email: user?.email || ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    try {
      await updateProfile({
        full_name: formData.name,
        phone: formData.phone,
        country: formData.country,
        language: formData.language
      });
      setIsEditing(false);
      toast({
        title: "Profil mis à jour",
        description: "Vos informations ont été sauvegardées avec succès.",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le profil.",
        variant: "destructive",
      });
    }
  };

  const handleCancel = () => {
    setFormData({
      name: profile?.full_name || user?.name || '',
      phone: profile?.phone || '',
      country: profile?.country || '',
      language: profile?.language || 'fr',
      email: user?.email || ''
    });
    setIsEditing(false);
  };

  const handleStartKYC = () => {
    setShowKYC(true);
  };

  const handleWhatsAppClick = () => {
    const phoneNumber = '+14182619091';
    const message = 'Bonjour, je souhaiterais obtenir plus d\'informations sur Terex.';
    const whatsappUrl = `https://wa.me/${phoneNumber.replace('+', '')}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleShareTerex = () => {
    const terexUrl = 'https://terex.com';
    const shareText = 'Découvrez Terex - La plateforme de change et de transfert d\'argent';
    
    if (navigator.share) {
      navigator.share({
        title: 'Terex',
        text: shareText,
        url: terexUrl,
      }).catch(console.error);
    } else {
      // Fallback pour les navigateurs qui ne supportent pas l'API Web Share
      navigator.clipboard.writeText(`${shareText} - ${terexUrl}`).then(() => {
        toast({
          title: "Lien copié",
          description: "Le lien Terex a été copié dans le presse-papiers",
        });
      }).catch(() => {
        // Si le clipboard ne marche pas, ouvrir dans un nouvel onglet
        window.open(terexUrl, '_blank');
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-white">Chargement...</div>
      </div>
    );
  }

  if (showKYC) {
    return <KYCPage onBack={() => setShowKYC(false)} />;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Mon Profil</h1>
        <p className="text-gray-400">Gérez vos informations personnelles et préférences</p>
      </div>

      <KYCAlert status="pending" onStartKYC={handleStartKYC} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-terex-darker border-terex-gray">
          <CardHeader>
            <CardTitle className="text-white">Informations personnelles</CardTitle>
            <CardDescription className="text-gray-400">
              Mettez à jour vos informations de base
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {!isEditing ? (
              <>
                <div>
                  <Label className="text-gray-300">Nom complet</Label>
                  <p className="text-white mt-1">{formData.name || 'Non renseigné'}</p>
                </div>
                <div>
                  <Label className="text-gray-300">Email</Label>
                  <p className="text-white mt-1">{formData.email}</p>
                </div>
                <div>
                  <Label className="text-gray-300">Téléphone</Label>
                  <p className="text-white mt-1">{formData.phone || 'Non renseigné'}</p>
                </div>
                <div>
                  <Label className="text-gray-300">Pays</Label>
                  <p className="text-white mt-1">{formData.country || 'Non renseigné'}</p>
                </div>
                <div>
                  <Label className="text-gray-300">Langue</Label>
                  <p className="text-white mt-1">{formData.language === 'fr' ? 'Français' : 'English'}</p>
                </div>
                <Button 
                  onClick={() => setIsEditing(true)}
                  className="bg-terex-accent hover:bg-terex-accent/80"
                >
                  Modifier les informations
                </Button>
              </>
            ) : (
              <>
                <div>
                  <Label htmlFor="name" className="text-gray-300">Nom complet</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="bg-terex-gray border-terex-gray text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="email" className="text-gray-300">Email</Label>
                  <Input
                    id="email"
                    value={formData.email}
                    disabled
                    className="bg-terex-gray border-terex-gray text-gray-400"
                  />
                </div>
                <div>
                  <Label htmlFor="phone" className="text-gray-300">Téléphone</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="bg-terex-gray border-terex-gray text-white"
                    placeholder="+221 XX XXX XX XX"
                  />
                </div>
                <div>
                  <Label htmlFor="country" className="text-gray-300">Pays</Label>
                  <Select value={formData.country} onValueChange={(value) => handleInputChange('country', value)}>
                    <SelectTrigger className="bg-terex-gray border-terex-gray text-white">
                      <SelectValue placeholder="Sélectionnez votre pays" />
                    </SelectTrigger>
                    <SelectContent className="bg-terex-darker border-terex-gray">
                      <SelectItem value="senegal" className="text-white hover:bg-terex-gray">Sénégal</SelectItem>
                      <SelectItem value="mali" className="text-white hover:bg-terex-gray">Mali</SelectItem>
                      <SelectItem value="burkina" className="text-white hover:bg-terex-gray">Burkina Faso</SelectItem>
                      <SelectItem value="cote_ivoire" className="text-white hover:bg-terex-gray">Côte d'Ivoire</SelectItem>
                      <SelectItem value="canada" className="text-white hover:bg-terex-gray">Canada</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="language" className="text-gray-300">Langue</Label>
                  <Select value={formData.language} onValueChange={(value) => handleInputChange('language', value)}>
                    <SelectTrigger className="bg-terex-gray border-terex-gray text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-terex-darker border-terex-gray">
                      <SelectItem value="fr" className="text-white hover:bg-terex-gray">Français</SelectItem>
                      <SelectItem value="en" className="text-white hover:bg-terex-gray">English</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex space-x-2">
                  <Button 
                    onClick={handleSave}
                    className="bg-terex-accent hover:bg-terex-accent/80"
                  >
                    Sauvegarder
                  </Button>
                  <Button 
                    onClick={handleCancel}
                    variant="outline"
                    className="border-terex-gray text-gray-300 hover:bg-terex-gray"
                  >
                    Annuler
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <Card className="bg-terex-darker border-terex-gray">
          <CardHeader>
            <CardTitle className="text-white">Partager Terex</CardTitle>
            <CardDescription className="text-gray-400">
              Partagez Terex avec vos proches et contactez-nous
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <Button 
                onClick={handleShareTerex}
                variant="outline"
                className="w-full border-terex-accent text-terex-accent hover:bg-terex-accent hover:text-white"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Partager Terex
              </Button>
              
              <Button 
                onClick={handleWhatsAppClick}
                className="w-full bg-green-600 hover:bg-green-700 text-white"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Nous rejoindre sur WhatsApp
              </Button>
            </div>
            
            <div className="text-center text-sm text-gray-400 mt-4">
              <p>Partagez Terex avec vos proches et découvrez tous nos services</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <TransactionHistory transactions={transactions} />
    </div>
  );
}
