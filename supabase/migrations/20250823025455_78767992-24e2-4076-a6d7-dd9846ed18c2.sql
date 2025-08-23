-- Drop the existing blog_comments_public view
DROP VIEW IF EXISTS public.blog_comments_public;

-- Recreate the view without SECURITY DEFINER to ensure it uses the querying user's permissions
CREATE VIEW public.blog_comments_public AS
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

-- Enable RLS on the view (this will use the querying user's permissions)
ALTER VIEW public.blog_comments_public ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows everyone to view approved comments
CREATE POLICY "Anyone can view approved blog comments" 
ON public.blog_comments_public 
FOR SELECT 
USING (true);