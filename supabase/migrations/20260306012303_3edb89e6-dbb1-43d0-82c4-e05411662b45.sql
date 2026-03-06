
-- Drop existing FK constraints and recreate with ON DELETE SET NULL
ALTER TABLE public.email_notifications DROP CONSTRAINT IF EXISTS email_notifications_order_id_fkey;
ALTER TABLE public.email_notifications ADD CONSTRAINT email_notifications_order_id_fkey 
  FOREIGN KEY (order_id) REFERENCES public.orders(id) ON DELETE SET NULL;

ALTER TABLE public.fraud_alerts DROP CONSTRAINT IF EXISTS fraud_alerts_order_id_fkey;
ALTER TABLE public.fraud_alerts ADD CONSTRAINT fraud_alerts_order_id_fkey 
  FOREIGN KEY (order_id) REFERENCES public.orders(id) ON DELETE SET NULL;
