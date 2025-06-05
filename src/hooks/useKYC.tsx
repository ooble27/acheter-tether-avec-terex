
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface KYCData {
  id: string;
  user_id: string;
  status: 'pending' | 'submitted' | 'under_review' | 'approved' | 'rejected';
  first_name?: string;
  last_name?: string;
  date_of_birth?: string;
  nationality?: string;
  address?: string;
  city?: string;
  postal_code?: string;
  country?: string;
  phone_number?: string;
  identity_document_type?: 'passport' | 'national_id' | 'drivers_license';
  identity_document_number?: string;
  identity_document_front_url?: string;
  identity_document_back_url?: string;
  selfie_url?: string;
  proof_of_address_url?: string;
  submitted_at?: string;
  reviewed_at?: string;
  reviewed_by?: string;
  rejection_reason?: string;
  created_at: string;
  updated_at: string;
}

export const useKYC = () => {
  const [kycData, setKycData] = useState<KYCData | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchKYCData = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('kyc_verifications')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Erreur lors de la récupération des données KYC:', error);
        return;
      }

      // Cast the data to ensure proper typing
      if (data) {
        setKycData({
          ...data,
          status: data.status as KYCData['status']
        });
      }
    } catch (error) {
      console.error('Erreur inattendue:', error);
    } finally {
      setLoading(false);
    }
  };

  const submitKYC = async (formData: Partial<KYCData>) => {
    if (!user) return { error: 'Utilisateur non connecté' };

    try {
      const { error } = await supabase
        .from('kyc_verifications')
        .update({
          ...formData,
          status: 'submitted',
          submitted_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id);

      if (error) {
        console.error('Erreur lors de la soumission KYC:', error);
        return { error: error.message };
      }

      await fetchKYCData();
      
      toast({
        title: "Documents soumis avec succès",
        description: "Votre demande de vérification est en cours d'examen",
        className: "bg-green-600 text-white border-green-600",
      });

      return { success: true };
    } catch (error) {
      console.error('Erreur inattendue:', error);
      return { error: 'Erreur inattendue lors de la soumission' };
    }
  };

  const uploadDocument = async (file: File, documentType: string) => {
    if (!user) return { error: 'Utilisateur non connecté' };

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${documentType}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('kyc-documents')
        .upload(fileName, file, { upsert: true });

      if (uploadError) {
        console.error('Erreur upload:', uploadError);
        return { error: uploadError.message };
      }

      const { data } = supabase.storage
        .from('kyc-documents')
        .getPublicUrl(fileName);

      return { success: true, url: data.publicUrl };
    } catch (error) {
      console.error('Erreur inattendue upload:', error);
      return { error: 'Erreur lors du téléchargement du fichier' };
    }
  };

  useEffect(() => {
    fetchKYCData();
  }, [user]);

  return {
    kycData,
    loading,
    submitKYC,
    uploadDocument,
    refetch: fetchKYCData
  };
};
