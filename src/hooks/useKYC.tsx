
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface KYCData {
  id?: string;
  user_id?: string;
  status?: 'pending' | 'submitted' | 'under_review' | 'approved' | 'rejected';
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
  created_at?: string;
  updated_at?: string;
}

export const useKYC = () => {
  const [kycData, setKycData] = useState<KYCData | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchKYCData = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('kyc_verifications')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error('Erreur lors de la récupération des données KYC:', error);
        throw error;
      }

      // Type assertion pour résoudre le conflit TypeScript avec le status
      setKycData(data as KYCData);
    } catch (error) {
      console.error('Erreur lors de la récupération KYC:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les données de vérification",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const uploadDocument = async (file: File, documentType: string) => {
    if (!user) return { error: 'Utilisateur non connecté' };

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${documentType}_${Date.now()}.${fileExt}`;

      const { data, error } = await supabase.storage
        .from('kyc-documents')
        .upload(fileName, file);

      if (error) {
        console.error('Erreur upload:', error);
        return { error: error.message };
      }

      const { data: { publicUrl } } = supabase.storage
        .from('kyc-documents')
        .getPublicUrl(fileName);

      return { url: publicUrl };
    } catch (error) {
      console.error('Erreur lors du téléchargement:', error);
      return { error: 'Erreur lors du téléchargement' };
    }
  };

  const submitKYC = async (formData: Partial<KYCData>) => {
    if (!user) return { error: 'Utilisateur non connecté' };

    try {
      // CORRECTION: Ne soumettre que si toutes les informations requises sont présentes
      const requiredFields = [
        'first_name', 'last_name', 'date_of_birth', 'nationality',
        'address', 'city', 'country', 'phone_number',
        'identity_document_number', 'identity_document_front_url',
        'identity_document_back_url', 'selfie_url', 'proof_of_address_url'
      ];

      const missingFields = requiredFields.filter(field => !formData[field as keyof KYCData]);
      
      if (missingFields.length > 0) {
        console.log('Champs manquants:', missingFields);
        return { error: 'Veuillez remplir tous les champs requis' };
      }

      const submissionData = {
        ...formData,
        user_id: user.id,
        status: 'submitted',
        submitted_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('kyc_verifications')
        .upsert(submissionData)
        .select()
        .single();

      if (error) {
        console.error('Erreur lors de la soumission KYC:', error);
        return { error: error.message };
      }

      // Type assertion pour résoudre le conflit TypeScript avec le status
      setKycData(data as KYCData);
      
      toast({
        title: "KYC soumis",
        description: "Votre dossier de vérification a été soumis avec succès",
        className: "bg-green-600 text-white border-green-600",
      });

      return { success: true };
    } catch (error) {
      console.error('Erreur lors de la soumission:', error);
      return { error: 'Erreur lors de la soumission' };
    }
  };

  useEffect(() => {
    fetchKYCData();
  }, [user]);

  return {
    kycData,
    loading,
    uploadDocument,
    submitKYC,
    refetch: fetchKYCData
  };
};
