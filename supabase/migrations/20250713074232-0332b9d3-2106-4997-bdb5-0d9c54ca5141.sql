
-- Créer la table pour les alertes de fraude
CREATE TABLE public.fraud_alerts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  order_id UUID REFERENCES public.orders(id),
  alert_type TEXT NOT NULL CHECK (alert_type IN ('suspicious_amount', 'rapid_transactions', 'unusual_pattern', 'blacklisted_address', 'kyc_mismatch')),
  severity TEXT NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  description TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'dismissed', 'escalated')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  reviewed_by UUID,
  reviewed_at TIMESTAMP WITH TIME ZONE
);

-- Créer la table pour les paramètres 2FA
CREATE TABLE public.user_2fa_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  secret TEXT NOT NULL,
  backup_codes TEXT[] DEFAULT '{}',
  is_enabled BOOLEAN NOT NULL DEFAULT false,
  enabled_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Activer RLS sur les nouvelles tables
ALTER TABLE public.fraud_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_2fa_settings ENABLE ROW LEVEL SECURITY;

-- Politiques RLS pour fraud_alerts
CREATE POLICY "Admins can manage fraud alerts" 
  ON public.fraud_alerts 
  FOR ALL 
  USING (has_role(auth.uid(), 'admin'::user_role));

CREATE POLICY "Users can view their own fraud alerts" 
  ON public.fraud_alerts 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Politiques RLS pour user_2fa_settings
CREATE POLICY "Users can manage their own 2FA settings" 
  ON public.user_2fa_settings 
  FOR ALL 
  USING (auth.uid() = user_id);

-- Trigger pour updated_at sur user_2fa_settings
CREATE TRIGGER update_updated_at_user_2fa_settings
  BEFORE UPDATE ON public.user_2fa_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();
