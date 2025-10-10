-- Vérifier et corriger les triggers de création d'utilisateur
-- Le problème vient probablement du fait que les triggers échouent

-- D'abord, on supprime les anciens triggers pour les recréer proprement
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS on_auth_user_created_kyc ON auth.users;
DROP TRIGGER IF EXISTS on_auth_user_created_referral ON auth.users;
DROP TRIGGER IF EXISTS on_auth_user_created_referral_handling ON auth.users;

-- Recréer la fonction handle_new_user_profile avec gestion d'erreur
CREATE OR REPLACE FUNCTION public.handle_new_user_profile()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    -- Insérer le profil seulement s'il n'existe pas déjà
    INSERT INTO public.profiles (id, full_name)
    VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data ->> 'name', NEW.email))
    ON CONFLICT (id) DO NOTHING;
    RETURN NEW;
EXCEPTION
    WHEN OTHERS THEN
        -- Log l'erreur mais ne bloque pas la création de l'utilisateur
        RAISE WARNING 'Erreur lors de la création du profil pour %: %', NEW.id, SQLERRM;
        RETURN NEW;
END;
$$;

-- Recréer la fonction handle_new_user_kyc avec gestion d'erreur
CREATE OR REPLACE FUNCTION public.handle_new_user_kyc()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    -- Créer un enregistrement KYC par défaut seulement s'il n'existe pas
    INSERT INTO public.kyc_verifications (user_id, status)
    VALUES (NEW.id, 'pending')
    ON CONFLICT (user_id) DO NOTHING;
    
    -- Assigner le rôle utilisateur par défaut seulement s'il n'existe pas
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'user')
    ON CONFLICT DO NOTHING;
    
    RETURN NEW;
EXCEPTION
    WHEN OTHERS THEN
        -- Log l'erreur mais ne bloque pas la création de l'utilisateur
        RAISE WARNING 'Erreur lors de la création KYC pour %: %', NEW.id, SQLERRM;
        RETURN NEW;
END;
$$;

-- Recréer la fonction create_user_referral_code avec gestion d'erreur
CREATE OR REPLACE FUNCTION public.create_user_referral_code()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    -- Créer un code de parrainage seulement s'il n'existe pas
    INSERT INTO public.referral_codes (user_id, code)
    VALUES (NEW.id, generate_referral_code())
    ON CONFLICT (user_id) DO NOTHING;
    RETURN NEW;
EXCEPTION
    WHEN OTHERS THEN
        -- Log l'erreur mais ne bloque pas la création de l'utilisateur
        RAISE WARNING 'Erreur lors de la création du code de parrainage pour %: %', NEW.id, SQLERRM;
        RETURN NEW;
END;
$$;

-- Recréer la fonction handle_referral_on_signup avec gestion d'erreur
CREATE OR REPLACE FUNCTION public.handle_referral_on_signup()
RETURNS trigger
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
      VALUES (v_referrer_id, NEW.id, v_referral_code, 'pending')
      ON CONFLICT DO NOTHING;
    END IF;
  END IF;
  
  RETURN NEW;
EXCEPTION
    WHEN OTHERS THEN
        -- Log l'erreur mais ne bloque pas la création de l'utilisateur
        RAISE WARNING 'Erreur lors du traitement du parrainage pour %: %', NEW.id, SQLERRM;
        RETURN NEW;
END;
$$;

-- Recréer les triggers dans le bon ordre
-- 1. Créer le profil en premier
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_profile();

-- 2. Créer le KYC et le rôle
CREATE TRIGGER on_auth_user_created_kyc
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_kyc();

-- 3. Créer le code de parrainage
CREATE TRIGGER on_auth_user_created_referral
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.create_user_referral_code();

-- 4. Gérer le parrainage si applicable
CREATE TRIGGER on_auth_user_created_referral_handling
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_referral_on_signup();

-- Ajouter des contraintes UNIQUE manquantes si nécessaire
-- pour éviter les erreurs de doublons
DO $$
BEGIN
    -- Vérifier et ajouter une contrainte unique sur user_id pour kyc_verifications si elle n'existe pas
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'kyc_verifications_user_id_key'
    ) THEN
        ALTER TABLE public.kyc_verifications 
        ADD CONSTRAINT kyc_verifications_user_id_key UNIQUE (user_id);
    END IF;

    -- Vérifier et ajouter une contrainte unique sur user_id pour referral_codes si elle n'existe pas
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'referral_codes_user_id_key'
    ) THEN
        ALTER TABLE public.referral_codes 
        ADD CONSTRAINT referral_codes_user_id_key UNIQUE (user_id);
    END IF;
EXCEPTION
    WHEN OTHERS THEN
        RAISE WARNING 'Erreur lors de l''ajout des contraintes: %', SQLERRM;
END $$;