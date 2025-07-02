
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
    if (profile) {
      setFormData({
        name: profile.full_name || user?.name || '',
        phone: profile.phone || '',
        country: profile.country || '',
        language: profile.language || 'fr',
        email: user?.email || ''
      });
    }
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
    <Card className="bg-gradient-to-br from-terex-darker to-terex-dark border border-terex-gray/30 shadow-2xl backdrop-blur-sm">
      <CardHeader className="bg-gradient-to-r from-terex-accent/10 to-transparent border-b border-terex-gray/30 rounded-t-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-gradient-to-br from-terex-accent to-terex-accent/70 rounded-xl flex items-center justify-center mr-3">
              <User className="w-5 h-5 text-white" />
            </div>
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
              className="border-terex-accent/50 text-terex-accent hover:bg-terex-accent hover:text-white transition-all duration-200"
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
              <div className="p-4 bg-gradient-to-br from-terex-gray/40 to-terex-gray/20 rounded-xl border border-terex-gray/20 backdrop-blur-sm">
                <Label className="text-gray-400 text-sm font-medium">Nom complet</Label>
                <p className="text-white font-medium mt-1">{formData.name || 'Non renseigné'}</p>
              </div>
              <div className="p-4 bg-gradient-to-br from-terex-gray/40 to-terex-gray/20 rounded-xl border border-terex-gray/20 backdrop-blur-sm">
                <Label className="text-gray-400 text-sm font-medium">Email</Label>
                <p className="text-white font-medium mt-1">{formData.email}</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="p-4 bg-gradient-to-br from-terex-gray/40 to-terex-gray/20 rounded-xl border border-terex-gray/20 backdrop-blur-sm">
                <Label className="text-gray-400 text-sm font-medium">Téléphone</Label>
                <p className="text-white font-medium mt-1">{formData.phone || 'Non renseigné'}</p>
              </div>
              <div className="p-4 bg-gradient-to-br from-terex-gray/40 to-terex-gray/20 rounded-xl border border-terex-gray/20 backdrop-blur-sm">
                <Label className="text-gray-400 text-sm font-medium">Pays</Label>
                <p className="text-white font-medium mt-1">{formData.country || 'Non renseigné'}</p>
              </div>
            </div>
            
            <div className="p-4 bg-gradient-to-br from-terex-gray/40 to-terex-gray/20 rounded-xl border border-terex-gray/20 backdrop-blur-sm">
              <Label className="text-gray-400 text-sm font-medium">Langue</Label>
              <p className="text-white font-medium mt-1">{formData.language === 'fr' ? 'Français' : 'English'}</p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name" className="text-gray-300 font-medium">Nom complet</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="bg-terex-gray/50 border-terex-gray/30 text-white mt-2 focus:border-terex-accent transition-colors"
                />
              </div>
              <div>
                <Label htmlFor="phone" className="text-gray-300 font-medium">Téléphone</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="bg-terex-gray/50 border-terex-gray/30 text-white mt-2 focus:border-terex-accent transition-colors"
                  placeholder="+221 XX XXX XX XX"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="email" className="text-gray-300 font-medium">Email</Label>
              <Input
                id="email"
                value={formData.email}
                disabled
                className="bg-terex-gray/30 border-terex-gray/20 text-gray-400 mt-2"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="country" className="text-gray-300 font-medium">Pays</Label>
                <Select value={formData.country} onValueChange={(value) => handleInputChange('country', value)}>
                  <SelectTrigger className="bg-terex-gray/50 border-terex-gray/30 text-white mt-2 focus:border-terex-accent">
                    <SelectValue placeholder="Sélectionnez votre pays" />
                  </SelectTrigger>
                  <SelectContent className="bg-terex-darker border-terex-gray/30 backdrop-blur-sm">
                    <SelectItem value="senegal" className="text-white hover:bg-terex-gray/50">Sénégal</SelectItem>
                    <SelectItem value="mali" className="text-white hover:bg-terex-gray/50">Mali</SelectItem>
                    <SelectItem value="burkina" className="text-white hover:bg-terex-gray/50">Burkina Faso</SelectItem>
                    <SelectItem value="cote_ivoire" className="text-white hover:bg-terex-gray/50">Côte d'Ivoire</SelectItem>
                    <SelectItem value="niger" className="text-white hover:bg-terex-gray/50">Niger</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="language" className="text-gray-300 font-medium">Langue</Label>
                <Select value={formData.language} onValueChange={(value) => handleInputChange('language', value)}>
                  <SelectTrigger className="bg-terex-gray/50 border-terex-gray/30 text-white mt-2 focus:border-terex-accent">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-terex-darker border-terex-gray/30 backdrop-blur-sm">
                    <SelectItem value="fr" className="text-white hover:bg-terex-gray/50">Français</SelectItem>
                    <SelectItem value="en" className="text-white hover:bg-terex-gray/50">English</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex space-x-3 pt-4">
              <Button 
                onClick={handleSave}
                className="bg-gradient-to-r from-terex-accent to-terex-accent/80 hover:from-terex-accent/90 hover:to-terex-accent/70 text-white flex-1 transition-all duration-200"
              >
                <Save className="w-4 h-4 mr-2" />
                Sauvegarder
              </Button>
              <Button 
                onClick={handleCancel}
                variant="outline"
                className="border-terex-gray/30 text-gray-300 hover:bg-terex-gray/30 flex-1 transition-all duration-200"
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
