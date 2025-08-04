
-- Créer le bucket de stockage pour les documents investisseurs
INSERT INTO storage.buckets (id, name, public)
VALUES ('investor-documents', 'investor-documents', true);

-- Créer les politiques d'accès pour permettre la lecture publique
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING (bucket_id = 'investor-documents');

-- Permettre l'upload pour les utilisateurs authentifiés
CREATE POLICY "Allow authenticated uploads"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'investor-documents' AND auth.role() = 'authenticated');
