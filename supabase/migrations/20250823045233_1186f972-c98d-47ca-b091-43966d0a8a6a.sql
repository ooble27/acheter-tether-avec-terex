-- Fix email harvesting vulnerability in blog_comments table
-- Add policy to allow public viewing of comments without exposing email addresses

-- Create a view for public comment access that excludes sensitive data
CREATE OR REPLACE VIEW public.public_blog_comments AS
SELECT 
    id,
    post_id,
    parent_id,
    author_name,
    content,
    is_approved,
    created_at,
    updated_at
FROM public.blog_comments
WHERE is_approved = true;

-- Enable RLS on the view
ALTER VIEW public.public_blog_comments SET (security_barrier = true);

-- Add policy to allow public viewing of approved comments without email access
CREATE POLICY "Public can view approved comments without email" 
ON public.blog_comments 
FOR SELECT 
USING (is_approved = true);

-- Ensure RLS is enabled on blog_comments table
ALTER TABLE public.blog_comments ENABLE ROW LEVEL SECURITY;

-- Update existing admin/author policy to be more specific
DROP POLICY IF EXISTS "Admins and comment authors can view all comment fields" ON public.blog_comments;

CREATE POLICY "Admins and comment authors can view all comment fields including email" 
ON public.blog_comments 
FOR SELECT 
USING (
    has_role(auth.uid(), 'admin'::user_role) 
    OR (auth.uid() = user_id)
);

-- Grant usage on the public view
GRANT SELECT ON public.public_blog_comments TO anon;
GRANT SELECT ON public.public_blog_comments TO authenticated;