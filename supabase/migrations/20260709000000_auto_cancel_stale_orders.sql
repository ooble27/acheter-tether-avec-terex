-- Annulation automatique des ACHATS non payés après 30 minutes.
-- Un job pg_cron appelle la fonction edge auto-cancel-stale-orders toutes les
-- 5 minutes ; celle-ci annule les achats 'pending' (paiement Naboopay jamais
-- confirmé) créés il y a plus de 30 min et envoie l'email d'annulation au client.

create extension if not exists pg_cron with schema extensions;
create extension if not exists pg_net with schema extensions;

-- Reprogrammation idempotente (supprime l'ancien job s'il existe)
do $$
begin
  if exists (select 1 from cron.job where jobname = 'auto-cancel-stale-buy-orders') then
    perform cron.unschedule('auto-cancel-stale-buy-orders');
  end if;
end $$;

select cron.schedule(
  'auto-cancel-stale-buy-orders',
  '*/5 * * * *',
  $$
  select net.http_post(
    url := 'https://mwwjrrduavfcwjiyniuy.supabase.co/functions/v1/auto-cancel-stale-orders',
    headers := '{"Content-Type": "application/json"}'::jsonb,
    body := '{}'::jsonb
  );
  $$
);
