-- Drop the existing blog_comments_public view
DROP VIEW IF EXISTS public.blog_comments_public;

-- Recreate the view without SECURITY DEFINER to ensure it uses the querying user's permissions
-- This view will only show approved comments and will inherit the security context of the querying user
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