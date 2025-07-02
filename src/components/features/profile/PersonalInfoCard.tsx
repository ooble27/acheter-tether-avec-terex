import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useUserProfile } from '@/hooks/useUserProfile';
import { User, Edit3, Save, X } from 'lucide-react';

interface PersonalInfoCardProps {
  user: { email: string; name: string } | null;
}

export function PersonalInfoCard({ user }: PersonalInfoCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();
  const { profile, updateProfile } = useUserProfile();

  const [formData, setFormData] = useState({
    name: profile?.full_name || user?.name || '',
    phone: profile?.phone || '',
    country: profile?.country || '',
    language: profile?.language || 'fr',
    email: user?.email || ''
  });

  // Mettre à jour formData quand le profil change
  useEffect(() => {
    setFormData({
      name: profile?.full_name || user?.name || '',
      phone: profile?.phone || '',
      country: profile?.country || '',
      language: profile?.language || 'fr',
      email: user?.email || ''
    });
  }, [profile, user]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    try {
      const result = await updateProfile({
        full_name: formData.name,
        phone: formData.phone,
        country: formData.country,
        language: formData.language
      });

      if (result.error) {
        toast({
          title: "Erreur",
          description: result.error,
          variant: "destructive",
        });
        return;
      }

      setIsEditing(false);
      toast({
        title: "Profil mis à jour",
        description: "Vos informations ont été sauvegardées avec succès.",
        className: "bg-green-600 text-white border-green-600",
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

  return (
    <Card className="bg-gradient-to-br from-terex-darker to-terex-dark border-terex-gray shadow-2xl">
      <CardHeader className="bg-gradient-to-r from-terex-accent/10 to-transparent border-b border-terex-gray/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <User className="w-5 h-5 mr-2 text-terex-accent" />
            <div>
              <CardTitle className="text-white">Informations personnelles</CardTitle>
              <CardDescription className="text-gray-400">
                Gérez vos informations de base
              </CardDescription>
            </div>
          </div>
          {!isEditing && (
            <Button
              onClick={() => setIsEditing(true)}
              variant="outline"
              size="sm"
              className="border-terex-accent text-terex-accent hover:bg-terex-accent hover:text-white"
            >
              <Edit3 className="w-4 h-4 mr-2" />
              Modifier
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6 p-6">
        {!isEditing ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="p-4 bg-terex-gray/30 rounded-xl">
                <Label className="text-gray-400 text-sm">Nom complet</Label>
                <p className="text-white font-medium mt-1">{formData.name || 'Non renseigné'}</p>
              </div>
              <div className="p-4 bg-terex-gray/30 rounded-xl">
                <Label className="text-gray-400 text-sm">Email</Label>
                <p className="text-white font-medium mt-1">{formData.email}</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="p-4 bg-terex-gray/30 rounded-xl">
                <Label className="text-gray-400 text-sm">Téléphone</Label>
                <p className="text-white font-medium mt-1">{formData.phone || 'Non renseigné'}</p>
              </div>
              <div className="p-4 bg-terex-gray/30 rounded-xl">
                <Label className="text-gray-400 text-sm">Pays</Label>
                <p className="text-white font-medium mt-1">{formData.country || 'Non renseigné'}</p>
              </div>
            </div>
            
            <div className="p-4 bg-terex-gray/30 rounded-xl">
              <Label className="text-gray-400 text-sm">Langue</Label>
              <p className="text-white font-medium mt-1">{formData.language === 'fr' ? 'Français' : 'English'}</p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name" className="text-gray-300">Nom complet</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="bg-terex-gray border-terex-gray text-white mt-1"
                />
              </div>
              <div>
                <Label htmlFor="phone" className="text-gray-300">Téléphone</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="bg-terex-gray border-terex-gray text-white mt-1"
                  placeholder="+221 XX XXX XX XX"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="email" className="text-gray-300">Email</Label>
              <Input
                id="email"
                value={formData.email}
                disabled
                className="bg-terex-gray border-terex-gray text-gray-400 mt-1"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="country" className="text-gray-300">Pays</Label>
                <Select value={formData.country} onValueChange={(value) => handleInputChange('country', value)}>
                  <SelectTrigger className="bg-terex-gray border-terex-gray text-white mt-1">
                    <SelectValue placeholder="Sélectionnez votre pays" />
                  </SelectTrigger>
                  <SelectContent className="bg-terex-darker border-terex-gray">
                    <SelectItem value="senegal" className="text-white hover:bg-terex-gray">Sénégal</SelectItem>
                    <SelectItem value="mali" className="text-white hover:bg-terex-gray">Mali</SelectItem>
                    <SelectItem value="burkina" className="text-white hover:bg-terex-gray">Burkina Faso</SelectItem>
                    <SelectItem value="cote_ivoire" className="text-white hover:bg-terex-gray">Côte d'Ivoire</SelectItem>
                    <SelectItem value="niger" className="text-white hover:bg-terex-gray">Niger</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="language" className="text-gray-300">Langue</Label>
                <Select value={formData.language} onValueChange={(value) => handleInputChange('language', value)}>
                  <SelectTrigger className="bg-terex-gray border-terex-gray text-white mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-terex-darker border-terex-gray">
                    <SelectItem value="fr" className="text-white hover:bg-terex-gray">Français</SelectItem>
                    <SelectItem value="en" className="text-white hover:bg-terex-gray">English</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex space-x-3 pt-4">
              <Button 
                onClick={handleSave}
                className="bg-terex-accent hover:bg-terex-accent/80 text-white flex-1"
              >
                <Save className="w-4 h-4 mr-2" />
                Sauvegarder
              </Button>
              <Button 
                onClick={handleCancel}
                variant="outline"
                className="border-terex-gray text-gray-300 hover:bg-terex-gray flex-1"
              >
                <X className="w-4 h-4 mr-2" />
                Annuler
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
