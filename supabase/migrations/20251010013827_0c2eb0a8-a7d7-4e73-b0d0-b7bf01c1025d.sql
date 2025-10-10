-- Supprimer toutes les commandes existantes pour préparer le lancement officiel
-- Ne touche pas aux vérifications KYC
-- Suppression dans le bon ordre pour respecter toutes les contraintes de clés étrangères

-- Supprimer les alertes de fraude liées aux commandes
DELETE FROM fraud_alerts;

-- Supprimer les notifications email
DELETE FROM email_notifications;

-- Supprimer les commandes
DELETE FROM orders;

-- Supprimer tous les transferts internationaux
DELETE FROM international_transfers;