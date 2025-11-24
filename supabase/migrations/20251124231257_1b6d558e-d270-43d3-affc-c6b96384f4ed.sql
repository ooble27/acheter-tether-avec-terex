-- Create manual_transactions table for accounting
CREATE TABLE public.manual_transactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  transaction_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  amount NUMERIC NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  crypto_amount NUMERIC NOT NULL,
  crypto_currency TEXT NOT NULL DEFAULT 'USDT',
  buy_price NUMERIC NOT NULL,
  sell_price NUMERIC NOT NULL,
  profit NUMERIC GENERATED ALWAYS AS ((sell_price - buy_price) * crypto_amount) STORED,
  profit_percentage NUMERIC GENERATED ALWAYS AS (((sell_price - buy_price) / buy_price) * 100) STORED,
  client_name TEXT,
  client_phone TEXT,
  payment_method TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.manual_transactions ENABLE ROW LEVEL SECURITY;

-- Policy for admins only
CREATE POLICY "Admins can manage manual transactions"
ON public.manual_transactions
FOR ALL
USING (has_role(auth.uid(), 'admin'));

-- Add updated_at trigger
CREATE TRIGGER update_manual_transactions_updated_at
BEFORE UPDATE ON public.manual_transactions
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

-- Add index for better query performance
CREATE INDEX idx_manual_transactions_user_id ON public.manual_transactions(user_id);
CREATE INDEX idx_manual_transactions_date ON public.manual_transactions(transaction_date DESC);