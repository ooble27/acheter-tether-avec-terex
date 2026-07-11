-- Phase 2 (script 1/2) — Nouveaux rôles métier
-- ⚠️ IMPORTANT : exécuter ce script SEUL, puis exécuter le script 2 SÉPARÉMENT.
-- (PostgreSQL interdit d'utiliser une nouvelle valeur d'enum dans la même transaction
--  que son ajout.)

alter type public.user_role add value if not exists 'operator';   -- Opérateur : traite les commandes
alter type public.user_role add value if not exists 'marketing';  -- Marketing : campagnes email
alter type public.user_role add value if not exists 'hr';         -- RH : candidatures
alter type public.user_role add value if not exists 'support';    -- Support client
