-- Rendre user_id nullable pour permettre les candidatures sans compte
ALTER TABLE public.job_applications 
ALTER COLUMN user_id DROP NOT NULL;

-- Mettre à jour les RLS policies pour permettre aux utilisateurs non authentifiés d'insérer des candidatures
DROP POLICY IF EXISTS "Users can insert their own job applications" ON public.job_applications;

-- Nouvelle policy: tout le monde peut insérer une candidature
CREATE POLICY "Anyone can insert job applications"
ON public.job_applications
FOR INSERT
TO public
WITH CHECK (true);

-- Policy pour la lecture: les utilisateurs authentifiés peuvent voir leurs propres candidatures
CREATE POLICY "Users can view their own job applications"
ON public.job_applications
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Les admins peuvent tout voir (si pas déjà créé)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'job_applications' 
    AND policyname = 'Admins can view all job applications'
  ) THEN
    CREATE POLICY "Admins can view all job applications"
    ON public.job_applications
    FOR SELECT
    TO authenticated
    USING (
      EXISTS (
        SELECT 1 FROM public.user_roles
        WHERE user_id = auth.uid() AND role = 'admin'
      )
    );
  END IF;
END $$;