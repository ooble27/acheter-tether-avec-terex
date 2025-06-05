
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
      
      // Essayer de récupérer d'abord les données existantes
      let { data, error } = await supabase
        .from('kyc_verifications')
        .select('*')
        .eq('user_id', user.id)
        .single();

      // Si aucun enregistrement n'existe, en créer un
      if (error && error.code === 'PGRST116') {
        console.log('Aucun enregistrement KYC trouvé, création d\'un nouveau...');
        
        const { data: newData, error: insertError } = await supabase
          .from('kyc_verifications')
          .insert({
            user_id: user.id,
            status: 'pending'
          })
          .select()
          .single();

        if (insertError) {
          console.error('Erreur lors de la création KYC:', insertError);
          return;
        }
        
        data = newData;
      } else if (error) {
        console.error('Erreur lors de la récupération des données KYC:', error);
        return;
      }

      // Cast the data to ensure proper typing
      if (data) {
        console.log("Données KYC récupérées:", data);
        
        setKycData({
          id: data.id,
          user_id: data.user_id,
          status: data.status as KYCData['status'],
          first_name: data.first_name || undefined,
          last_name: data.last_name || undefined,
          date_of_birth: data.date_of_birth || undefined,
          nationality: data.nationality || undefined,
          address: data.address || undefined,
          city: data.city || undefined,
          postal_code: data.postal_code || undefined,
          country: data.country || undefined,
          phone_number: data.phone_number || undefined,
          identity_document_type: data.identity_document_type as KYCData['identity_document_type'] || undefined,
          identity_document_number: data.identity_document_number || undefined,
          identity_document_front_url: data.identity_document_front_url || undefined,
          identity_document_back_url: data.identity_document_back_url || undefined,
          selfie_url: data.selfie_url || undefined,
          proof_of_address_url: data.proof_of_address_url || undefined,
          submitted_at: data.submitted_at || undefined,
          reviewed_at: data.reviewed_at || undefined,
          reviewed_by: data.reviewed_by || undefined,
          rejection_reason: data.rejection_reason || undefined,
          created_at: data.created_at || new Date().toISOString(),
          updated_at: data.updated_at || new Date().toISOString()
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
      console.log('Soumission KYC pour utilisateur:', user.id);
      console.log('Données à soumettre:', formData);

      const updateData = {
        ...formData,
        status: 'submitted',
        submitted_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('kyc_verifications')
        .update(updateData)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) {
        console.error('Erreur lors de la soumission KYC:', error);
        toast({
          title: "Erreur de soumission",
          description: "Impossible de soumettre votre demande. Veuillez réessayer.",
          variant: "destructive"
        });
        return { error: error.message };
      }

      console.log('KYC soumis avec succès:', data);
      
      await fetchKYCData();
      
      toast({
        title: "Documents soumis avec succès",
        description: "Votre demande de vérification est en cours d'examen",
        className: "bg-green-600 text-white border-green-600",
      });

      return { success: true };
    } catch (error) {
      console.error('Erreur inattendue:', error);
      toast({
        title: "Erreur technique",
        description: "Une erreur inattendue s'est produite. Veuillez réessayer.",
        variant: "destructive"
      });
      return { error: 'Erreur inattendue lors de la soumission' };
    }
  };

  const uploadDocument = async (file: File, documentType: string) => {
    if (!user) return { error: 'Utilisateur non connecté' };

    try {
      console.log('Upload du document:', documentType, 'pour utilisateur:', user.id);
      
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${documentType}.${fileExt}`;
      console.log('Nom de fichier pour upload:', fileName);

      // Vérifier si le bucket existe
      const { data: buckets, error: bucketsError } = await supabase.storage
        .listBuckets();
      
      console.log('Buckets disponibles:', buckets?.map(b => b.name));
      
      if (bucketsError) {
        console.error('Erreur lors de la récupération des buckets:', bucketsError);
        return { error: 'Erreur lors de la récupération des buckets' };
      }

      const bucketExists = buckets?.some(b => b.name === 'kyc-documents');
      if (!bucketExists) {
        console.error('Bucket kyc-documents n\'existe pas');
        return { error: 'Le bucket kyc-documents n\'existe pas' };
      }

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

      console.log('Document uploadé avec succès:', data.publicUrl);
      
      // Stocker l'URL complète dans la base de données
      return { success: true, url: fileName };
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
