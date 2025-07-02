
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface UserProfile {
  full_name: string;
  phone: string;
  country: string;
  language: string;
}

export const useUserProfile = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchProfile = async () => {
    if (!user) {
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      console.log('Récupération du profil pour l\'utilisateur:', user.id);
      
      const { data, error } = await supabase
        .from('profiles')
        .select('full_name, phone, country, language')
        .eq('id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching profile:', error);
        // Créer un profil par défaut si aucun n'existe
        const defaultProfile = {
          full_name: user.user_metadata?.name || user.user_metadata?.full_name || user.email?.split('@')[0] || '',
          phone: user.user_metadata?.phone || '',
          country: user.user_metadata?.country || '',
          language: 'fr'
        };
        
        console.log('Création d\'un profil par défaut:', defaultProfile);
        
        // Insérer le profil par défaut dans la base de données
        const { error: insertError } = await supabase
          .from('profiles')
          .insert({
            id: user.id,
            ...defaultProfile
          });

        if (insertError) {
          console.error('Erreur lors de la création du profil par défaut:', insertError);
        } else {
          console.log('Profil par défaut créé avec succès');
          setProfile(defaultProfile);
        }
      } else if (data) {
        console.log('Profil récupéré:', data);
        setProfile(data);
      } else {
        console.log('Aucun profil trouvé, création d\'un profil par défaut');
        const defaultProfile = {
          full_name: user.user_metadata?.name || user.user_metadata?.full_name || user.email?.split('@')[0] || '',
          phone: user.user_metadata?.phone || '',
          country: user.user_metadata?.country || '',
          language: 'fr'
        };
        
        // Créer le profil dans la base de données
        const { error: insertError } = await supabase
          .from('profiles')
          .insert({
            id: user.id,
            ...defaultProfile
          });

        if (!insertError) {
          console.log('Nouveau profil créé:', defaultProfile);
          setProfile(defaultProfile);
        } else {
          console.error('Erreur lors de la création du profil:', insertError);
        }
      }
    } catch (error) {
      console.error('Error in fetchProfile:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user) return { error: 'No user logged in' };

    try {
      console.log('Mise à jour du profil avec:', updates);
      
      // Préparer les données à mettre à jour
      const updateData = {
        id: user.id,
        full_name: updates.full_name || profile?.full_name || '',
        phone: updates.phone || profile?.phone || '',
        country: updates.country || profile?.country || '',
        language: updates.language || profile?.language || 'fr',
        updated_at: new Date().toISOString()
      };

      console.log('Données à sauvegarder:', updateData);
      
      const { error } = await supabase
        .from('profiles')
        .upsert(updateData, {
          onConflict: 'id'
        });

      if (error) {
        console.error('Error updating profile:', error);
        return { error: error.message };
      }

      // Update local state immédiatement
      const newProfile = {
        full_name: updateData.full_name,
        phone: updateData.phone,
        country: updateData.country,
        language: updateData.language
      };
      
      console.log('Mise à jour du state local avec:', newProfile);
      setProfile(newProfile);
      
      console.log('Profil mis à jour avec succès');
      return { error: null };
    } catch (error) {
      console.error('Error in updateProfile:', error);
      return { error: 'Une erreur est survenue lors de la mise à jour' };
    }
  };

  const updateEmail = async (newEmail: string) => {
    if (!user) return { error: 'No user logged in' };

    try {
      const { error } = await supabase.auth.updateUser({
        email: newEmail
      });

      if (error) {
        console.error('Error updating email:', error);
        return { error: error.message };
      }

      toast({
        title: "Email mis à jour",
        description: "Un email de confirmation a été envoyé à votre nouvelle adresse",
        className: "bg-green-600 text-white border-green-600",
      });

      return { error: null };
    } catch (error) {
      console.error('Error in updateEmail:', error);
      return { error: 'Une erreur est survenue lors de la mise à jour de l\'email' };
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [user]);

  return {
    profile,
    loading,
    updateProfile,
    updateEmail,
    refetch: fetchProfile
  };
};
