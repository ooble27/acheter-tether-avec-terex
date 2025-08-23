-- Remove the conflicting public policy that exposes emails
DROP POLICY IF EXISTS "Public can view approved comments" ON public.blog_comments;

-- Create a secure public view that excludes email addresses
CREATE VIEW public.blog_comments_public AS
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

-- Grant access to the public view
GRANT SELECT ON public.blog_comments_public TO anon;
GRANT SELECT ON public.blog_comments_public TO authenticated;

-- Ensure the main table only allows access to admins and comment authors
-- (the existing policies already handle this correctly)