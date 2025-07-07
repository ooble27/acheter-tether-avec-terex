-- Modifier la politique pour permettre les candidatures anonymes
DROP POLICY "Users can create their own applications" ON public.job_applications;

-- Nouvelle politique qui permet les candidatures avec ou sans utilisateur connecté
CREATE POLICY "Anyone can create applications" 
ON public.job_applications 
FOR INSERT 
WITH CHECK (true);

-- Créer un bucket pour les CVs
INSERT INTO storage.buckets (id, name, public) VALUES ('cvs', 'cvs', false);

-- Politiques pour le bucket CVs
CREATE POLICY "Anyone can upload CVs" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'cvs');

CREATE POLICY "Admins can view all CVs" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'cvs' AND has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can view their own CVs" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'cvs' AND auth.uid()::text = (storage.foldername(name))[1]);