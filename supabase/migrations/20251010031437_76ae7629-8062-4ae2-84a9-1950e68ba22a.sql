-- Fonction pour traiter le code de parrainage lors de l'inscription
CREATE OR REPLACE FUNCTION public.handle_referral_on_signup()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_referral_code TEXT;
  v_referrer_id UUID;
BEGIN
  -- Récupérer le code de parrainage depuis les métadonnées utilisateur
  v_referral_code := NEW.raw_user_meta_data->>'referral_code';
  
  -- Si un code de parrainage a été fourni
  IF v_referral_code IS NOT NULL AND v_referral_code != '' THEN
    -- Vérifier que le code existe et récupérer l'ID du parrain
    SELECT user_id INTO v_referrer_id
    FROM referral_codes
    WHERE code = v_referral_code AND is_active = true;
    
    -- Si le code est valide
    IF v_referrer_id IS NOT NULL THEN
      -- Mettre à jour le profil avec le code de parrainage
      UPDATE profiles
      SET referred_by_code = v_referral_code
      WHERE id = NEW.id;
      
      -- Créer un enregistrement de parrainage
      INSERT INTO referrals (referrer_id, referred_id, referral_code, status)
      VALUES (v_referrer_id, NEW.id, v_referral_code, 'pending');
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Créer le trigger qui s'exécute après la création du profil
DROP TRIGGER IF EXISTS on_profile_created_handle_referral ON auth.users;
CREATE TRIGGER on_profile_created_handle_referral
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_referral_on_signup();