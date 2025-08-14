-- Fix security issue: Protect email addresses in blog comments from public access

-- Create a public view for blog comments that excludes sensitive fields like email
CREATE OR REPLACE VIEW public.blog_comments_public AS
SELECT 
  id,
  post_id,
  parent_id,
  author_name,
  content,
  is_approved,
  created_at,
  updated_at,
  user_id
FROM public.blog_comments
WHERE is_approved = true;

-- Update RLS policy to restrict direct table access
-- Drop the existing public policy
DROP POLICY IF EXISTS "Anyone can view approved comments" ON public.blog_comments;

-- Create new restrictive policy for direct table access
CREATE POLICY "Admins and comment authors can view all comment fields" 
ON public.blog_comments 
FOR SELECT 
USING (
  has_role(auth.uid(), 'admin'::user_role) OR 
  auth.uid() = user_id
);

-- Allow public read access to the safe view
-- Note: Views inherit RLS from underlying tables, but we can grant explicit access
GRANT SELECT ON public.blog_comments_public TO anon, authenticated;

-- Add comment to document the security change
COMMENT ON VIEW public.blog_comments_public IS 'Public view of blog comments without sensitive fields like email addresses to prevent harvesting';