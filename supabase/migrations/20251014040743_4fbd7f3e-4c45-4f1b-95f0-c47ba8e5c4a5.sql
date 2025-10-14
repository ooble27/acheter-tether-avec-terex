-- Ajouter un code QR permanent pour chaque marchand
ALTER TABLE public.merchant_accounts
ADD COLUMN IF NOT EXISTS merchant_qr_code TEXT UNIQUE;

-- Créer une fonction pour générer un code QR unique pour un marchand
CREATE OR REPLACE FUNCTION generate_merchant_qr_code()
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
  new_code TEXT;
  code_exists BOOLEAN;
BEGIN
  LOOP
    new_code := 'MRCH-' || upper(substring(encode(gen_random_bytes(8), 'hex'), 1, 12));
    SELECT EXISTS(SELECT 1 FROM merchant_accounts WHERE merchant_qr_code = new_code) INTO code_exists;
    EXIT WHEN NOT code_exists;
  END LOOP;
  RETURN new_code;
END;
$$;

-- Trigger pour générer automatiquement un QR code lors de la création d'un compte marchand
CREATE OR REPLACE FUNCTION set_merchant_qr_code()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.merchant_qr_code IS NULL THEN
    NEW.merchant_qr_code := generate_merchant_qr_code();
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trigger_set_merchant_qr_code ON public.merchant_accounts;
CREATE TRIGGER trigger_set_merchant_qr_code
BEFORE INSERT ON public.merchant_accounts
FOR EACH ROW
EXECUTE FUNCTION set_merchant_qr_code();

-- Générer des QR codes pour les comptes marchands existants
UPDATE public.merchant_accounts
SET merchant_qr_code = generate_merchant_qr_code()
WHERE merchant_qr_code IS NULL;