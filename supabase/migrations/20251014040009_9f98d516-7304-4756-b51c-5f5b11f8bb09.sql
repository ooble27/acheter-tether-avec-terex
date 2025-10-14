-- Créer la table pour les logs de webhooks
CREATE TABLE IF NOT EXISTS public.webhook_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  merchant_id UUID NOT NULL REFERENCES public.merchant_accounts(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  payload JSONB NOT NULL,
  url TEXT NOT NULL,
  response_status INTEGER,
  response_body TEXT,
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  delivered_at TIMESTAMP WITH TIME ZONE
);

-- Index pour améliorer les performances
CREATE INDEX idx_webhook_logs_merchant_id ON public.webhook_logs(merchant_id);
CREATE INDEX idx_webhook_logs_created_at ON public.webhook_logs(created_at DESC);

-- RLS policies
ALTER TABLE public.webhook_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Les marchands peuvent voir leurs propres logs de webhooks"
ON public.webhook_logs
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.merchant_accounts
    WHERE merchant_accounts.id = webhook_logs.merchant_id
    AND merchant_accounts.user_id = auth.uid()
  )
);

CREATE POLICY "Le service peut insérer des logs de webhooks"
ON public.webhook_logs
FOR INSERT
WITH CHECK (true);