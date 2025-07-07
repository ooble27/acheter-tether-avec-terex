-- Créer une table pour les candidatures
CREATE TABLE public.job_applications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  position TEXT NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  location TEXT,
  experience_years INTEGER,
  cv_url TEXT,
  cover_letter TEXT,
  linkedin_profile TEXT,
  portfolio_url TEXT,
  availability TEXT,
  salary_expectation TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  admin_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Activer RLS
ALTER TABLE public.job_applications ENABLE ROW LEVEL SECURITY;

-- Politique pour que les utilisateurs puissent créer leurs candidatures
CREATE POLICY "Users can create their own applications" 
ON public.job_applications 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Politique pour que les utilisateurs puissent voir leurs candidatures
CREATE POLICY "Users can view their own applications" 
ON public.job_applications 
FOR SELECT 
USING (auth.uid() = user_id);

-- Politique pour que les admins puissent tout voir et modifier
CREATE POLICY "Admins can manage all applications" 
ON public.job_applications 
FOR ALL 
USING (has_role(auth.uid(), 'admin'));

-- Trigger pour updated_at
CREATE TRIGGER update_job_applications_updated_at
  BEFORE UPDATE ON public.job_applications
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();