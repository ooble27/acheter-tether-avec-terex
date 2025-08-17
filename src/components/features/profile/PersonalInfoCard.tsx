import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useUserProfile } from '@/hooks/useUserProfile';
import { User, Edit3, Save, X } from 'lucide-react';
import type { User as SupabaseUser } from '@supabase/supabase-js';

interface PersonalInfoCardProps {
  user: SupabaseUser | null;
}

export function PersonalInfoCard({ user }: PersonalInfoCardProps) {
  const { profile, loading, updateProfile } = useUserProfile();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    country: '',
    language: 'fr'
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || '',
        phone: profile.phone || '',
        country: profile.country || '',
        language: profile.language || 'fr'
      });
    }
  }, [profile]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    const result = await updateProfile(formData);
    if (!result.error) {
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    if (profile) {
      setFormData({
        full_name: profile.full_name || '',
        phone: profile.phone || '',
        country: profile.country || '',
        language: profile.language || 'fr'
      });
    }
  };

  return (
    <Card className="bg-gradient-to-br from-terex-darker to-terex-dark border border-terex-gray/30 shadow-2xl backdrop-blur-sm">
      <CardHeader className="bg-gradient-to-r from-terex-accent/10 to-transparent border-b border-terex-gray/30 rounded-t-xl">
        <div className="flex items-center">
          <div className="w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-terex-accent to-terex-accent/70 rounded-xl flex items-center justify-center mr-3">
            <User className="w-6 h-6 md:w-7 md:h-7 text-white" />
          </div>
          <div>
            <CardTitle className="text-white">Informations personnelles</CardTitle>
            <CardDescription className="text-gray-400">
              Gérez vos informations personnelles
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-4">
        {isEditing ? (
          <div className="space-y-4">
            <div>
              <Label htmlFor="full_name" className="text-gray-300 font-medium">Nom complet</Label>
              <Input
                id="full_name"
                value={formData.full_name}
                onChange={(e) => handleInputChange('full_name', e.target.value)}
                placeholder="Votre nom complet"
                className="bg-terex-darker/50 border-terex-gray/30 text-white mt-2 focus:border-terex-accent transition-colors"
              />
            </div>
            
            <div>
              <Label htmlFor="phone" className="text-gray-300 font-medium">Numéro de téléphone</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="Votre numéro de téléphone"
                className="bg-terex-darker/50 border-terex-gray/30 text-white mt-2 focus:border-terex-accent transition-colors"
              />
            </div>

            <div>
              <Label htmlFor="country" className="text-gray-300 font-medium">Pays</Label>
              <Input
                id="country"
                value={formData.country}
                onChange={(e) => handleInputChange('country', e.target.value)}
                placeholder="Votre pays de résidence"
                className="bg-terex-darker/50 border-terex-gray/30 text-white mt-2 focus:border-terex-accent transition-colors"
              />
            </div>

            <div>
              <Label htmlFor="language" className="text-gray-300 font-medium">Langue</Label>
              <Select value={formData.language} onValueChange={(value) => handleInputChange('language', value)}>
                <SelectTrigger className="bg-terex-darker/50 border-terex-gray/30 text-white mt-2 w-full">
                  <SelectValue placeholder="Sélectionnez une langue" />
                </SelectTrigger>
                <SelectContent className="bg-terex-darker border-terex-gray">
                  <SelectItem value="fr">Français</SelectItem>
                  <SelectItem value="en">Anglais</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-end space-x-2">
              <Button
                variant="secondary"
                onClick={handleCancel}
                className="bg-terex-darker/50 hover:bg-terex-darker/70 text-gray-300 border-terex-gray/30"
              >
                <X className="w-4 h-4 mr-2" />
                Annuler
              </Button>
              <Button
                onClick={handleSave}
                className="bg-gradient-to-r from-terex-accent to-terex-accent/80 hover:from-terex-accent/90 hover:to-terex-accent/70 text-white"
              >
                <Save className="w-4 h-4 mr-2" />
                Enregistrer
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="bg-terex-darker/50 rounded-xl p-4 border border-terex-gray/20">
              <p className="text-gray-400 text-sm mb-2 font-medium">Informations :</p>
              <p className="text-white text-sm"><strong>Nom :</strong> {profile?.full_name || user?.user_metadata?.name || user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Non renseigné'}</p>
              <p className="text-white text-sm"><strong>Email :</strong> {user?.email}</p>
              {profile?.phone && (
                <p className="text-white text-sm"><strong>Téléphone :</strong> {profile.phone}</p>
              )}
              {profile?.country && (
                <p className="text-white text-sm"><strong>Pays :</strong> {profile.country}</p>
              )}
              {profile?.language && (
                <p className="text-white text-sm"><strong>Langue :</strong> {profile.language === 'fr' ? 'Français' : 'Anglais'}</p>
              )}
            </div>
            <Button
              onClick={() => setIsEditing(true)}
              className="w-full bg-gradient-to-r from-terex-accent/10 to-transparent hover:from-terex-accent/20 text-terex-accent border border-terex-accent/30"
            >
              <Edit3 className="w-4 h-4 mr-2" />
              Modifier
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
