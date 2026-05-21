import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface BusinessKYBData {
  id?: string;
  company_name: string;
  legal_form: string;
  rccm_number: string;
  ninea_number: string;
  country: string;
  city: string;
  address: string;
  sector: string;
  rep_name: string;
  rep_role: string;
  rep_phone: string;
  rep_id_document_url: string;
  rccm_document_url: string;
  ninea_document_url: string;
  address_proof_url: string;
  status: 'pending' | 'submitted' | 'under_review' | 'approved' | 'rejected';
  rejection_reason?: string;
  submitted_at?: string;
}

const EMPTY: BusinessKYBData = {
  company_name: '', legal_form: '', rccm_number: '', ninea_number: '',
  country: 'Sénégal', city: '', address: '', sector: '',
  rep_name: '', rep_role: '', rep_phone: '',
  rep_id_document_url: '', rccm_document_url: '', ninea_document_url: '', address_proof_url: '',
  status: 'pending',
};

export function useBusinessKYB(userId: string) {
  const [data, setData] = useState<BusinessKYBData>(EMPTY);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const { data: row, error: err } = await supabase
        .from('business_kyb' as any)
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();
      if (err) throw err;
      if (row) setData(row as BusinessKYBData);
    } catch (e: any) {
      // table may not exist yet
      console.warn('business_kyb:', e.message);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => { fetch(); }, [fetch]);

  const save = useCallback(async (partial: Partial<BusinessKYBData>) => {
    if (!userId) return;
    setSaving(true);
    setError(null);
    try {
      const { error: err } = await supabase
        .from('business_kyb' as any)
        .upsert({ ...data, ...partial, user_id: userId }, { onConflict: 'user_id' });
      if (err) throw err;
      setData(prev => ({ ...prev, ...partial }));
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  }, [userId, data]);

  const uploadDocument = useCallback(async (file: File, field: string): Promise<string> => {
    const ext = file.name.split('.').pop();
    const path = `kyb/${userId}/${field}_${Date.now()}.${ext}`;
    const { error: err } = await supabase.storage.from('kyc-documents').upload(path, file, { upsert: true });
    if (err) throw err;
    const { data: { publicUrl } } = supabase.storage.from('kyc-documents').getPublicUrl(path);
    return publicUrl;
  }, [userId]);

  const submit = useCallback(async () => {
    await save({ status: 'submitted', submitted_at: new Date().toISOString() });
  }, [save]);

  return { data, loading, saving, error, save, uploadDocument, submit, refetch: fetch };
}
