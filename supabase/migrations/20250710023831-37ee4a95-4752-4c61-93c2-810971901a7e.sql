
-- Créer une table pour stocker les destinataires favoris des utilisateurs
CREATE TABLE public.favorite_recipients (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  recipient_name TEXT NOT NULL,
  recipient_phone TEXT,
  recipient_email TEXT,
  recipient_account TEXT,
  recipient_bank TEXT,
  recipient_country TEXT NOT NULL,
  receive_method TEXT NOT NULL, -- 'mobile', 'bank_transfer', 'cash_pickup'
  provider TEXT, -- 'wave', 'orange', etc.
  last_amount NUMERIC, -- Dernier montant envoyé pour suggestion
  usage_count INTEGER DEFAULT 1, -- Nombre de fois utilisé
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Activer RLS sur la table
ALTER TABLE public.favorite_recipients ENABLE ROW LEVEL SECURITY;

-- Politique pour que les utilisateurs puissent voir leurs propres destinataires
CREATE POLICY "Users can view their own recipients" 
  ON public.favorite_recipients 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Politique pour que les utilisateurs puissent créer leurs propres destinataires
CREATE POLICY "Users can create their own recipients" 
  ON public.favorite_recipients 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Politique pour que les utilisateurs puissent modifier leurs propres destinataires
CREATE POLICY "Users can update their own recipients" 
  ON public.favorite_recipients 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Politique pour que les utilisateurs puissent supprimer leurs propres destinataires
CREATE POLICY "Users can delete their own recipients" 
  ON public.favorite_recipients 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Créer un index pour améliorer les performances
CREATE INDEX idx_favorite_recipients_user_id ON public.favorite_recipients(user_id);
CREATE INDEX idx_favorite_recipients_usage ON public.favorite_recipients(user_id, usage_count DESC);
