
-- Mettre à jour l'enum payment_method pour inclure les nouveaux types
ALTER TYPE public.payment_method ADD VALUE IF NOT EXISTS 'wave';
ALTER TYPE public.payment_method ADD VALUE IF NOT EXISTS 'orange_money';
ALTER TYPE public.payment_method ADD VALUE IF NOT EXISTS 'interac';

-- Ajouter les colonnes manquantes à la table orders
ALTER TABLE public.orders 
ADD COLUMN IF NOT EXISTS recipient_name TEXT,
ADD COLUMN IF NOT EXISTS recipient_phone TEXT,
ADD COLUMN IF NOT EXISTS from_currency TEXT,
ADD COLUMN IF NOT EXISTS to_currency TEXT,
ADD COLUMN IF NOT EXISTS total_amount NUMERIC,
ADD COLUMN IF NOT EXISTS fees NUMERIC DEFAULT 0,
ADD COLUMN IF NOT EXISTS recipient_country TEXT,
ADD COLUMN IF NOT EXISTS is_deleted BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP WITH TIME ZONE;
