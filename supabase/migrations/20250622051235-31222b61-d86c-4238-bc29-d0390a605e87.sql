
-- Créer une table pour sauvegarder les wallets des utilisateurs
CREATE TABLE public.user_wallets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  wallet_type TEXT NOT NULL CHECK (wallet_type IN ('binance', 'personal')),
  wallet_name TEXT NOT NULL,
  email TEXT,
  username TEXT,
  wallet_id TEXT,
  address TEXT,
  network TEXT,
  is_default BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Ajouter RLS pour que les utilisateurs ne voient que leurs wallets
ALTER TABLE public.user_wallets ENABLE ROW LEVEL SECURITY;

-- Politique pour voir ses propres wallets
CREATE POLICY "Users can view their own wallets" 
  ON public.user_wallets 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Politique pour créer ses propres wallets
CREATE POLICY "Users can create their own wallets" 
  ON public.user_wallets 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Politique pour modifier ses propres wallets
CREATE POLICY "Users can update their own wallets" 
  ON public.user_wallets 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Politique pour supprimer ses propres wallets
CREATE POLICY "Users can delete their own wallets" 
  ON public.user_wallets 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Index pour améliorer les performances
CREATE INDEX idx_user_wallets_user_type 
ON public.user_wallets (user_id, wallet_type);

-- Trigger pour mettre à jour updated_at
CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.user_wallets 
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();
