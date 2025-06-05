
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
    if (!user) return;
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('full_name, phone, country, language')
        .eq('id', user.id)
        .maybeSingle();

      if (error) {
        console.error('Error fetching profile:', error);
      } else if (data) {
        setProfile(data);
      } else {
        // Create default profile if none exists
        const defaultProfile = {
          full_name: user.user_metadata?.name || user.email?.split('@')[0] || '',
          phone: '',
          country: '',
          language: 'Français'
        };
        setProfile(defaultProfile);
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
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          ...updates,
          updated_at: new Date().toISOString()
        });

      if (error) {
        console.error('Error updating profile:', error);
        return { error: error.message };
      }

      // Update local state without refetching
      setProfile(prev => prev ? { ...prev, ...updates } : null);

      toast({
        title: "Profil mis à jour",
        description: "Vos informations ont été sauvegardées avec succès",
        className: "bg-green-600 text-white border-green-600",
      });

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
