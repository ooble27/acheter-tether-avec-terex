-- Add admin_hidden column to orders table
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS admin_hidden boolean DEFAULT false;

-- Add admin_hidden column to international_transfers table  
ALTER TABLE public.international_transfers ADD COLUMN IF NOT EXISTS admin_hidden boolean DEFAULT false;