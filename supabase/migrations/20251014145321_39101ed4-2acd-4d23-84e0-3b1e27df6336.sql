-- Recréer les fonctions avec le bon schéma pour gen_random_bytes

-- Fonction pour générer un code de parrainage
CREATE OR REPLACE FUNCTION public.generate_referral_code()
RETURNS text
LANGUAGE plpgsql
SET search_path = public, extensions
AS $function$
DECLARE
  new_code TEXT;
  code_exists BOOLEAN;
BEGIN
  LOOP
    new_code := 'TRX-' || upper(substring(encode(extensions.gen_random_bytes(4), 'hex'), 1, 8));
    SELECT EXISTS(SELECT 1 FROM referral_codes WHERE code = new_code) INTO code_exists;
    EXIT WHEN NOT code_exists;
  END LOOP;
  RETURN new_code;
END;
$function$;

-- Fonction pour générer un code QR marchand
CREATE OR REPLACE FUNCTION public.generate_merchant_qr_code()
RETURNS text
LANGUAGE plpgsql
SET search_path = public, extensions
AS $function$
DECLARE
  new_code TEXT;
  code_exists BOOLEAN;
BEGIN
  LOOP
    new_code := 'MRCH-' || upper(substring(encode(extensions.gen_random_bytes(8), 'hex'), 1, 12));
    SELECT EXISTS(SELECT 1 FROM merchant_accounts WHERE merchant_qr_code = new_code) INTO code_exists;
    EXIT WHEN NOT code_exists;
  END LOOP;
  RETURN new_code;
END;
$function$;

-- Fonction pour générer une référence de paiement
CREATE OR REPLACE FUNCTION public.generate_payment_reference()
RETURNS text
LANGUAGE plpgsql
SET search_path = public, extensions
AS $function$
BEGIN
  RETURN 'TPY-' || upper(substring(encode(extensions.gen_random_bytes(8), 'hex'), 1, 12));
END;
$function$;