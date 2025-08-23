-- Fix the security definer view issue
-- Drop the problematic view and recreate without security barrier
DROP VIEW IF EXISTS public.public_blog_comments;

-- Create a secure view for public comment access that excludes sensitive data
-- Using a regular view without security_barrier to avoid the security definer issue
CREATE VIEW public.public_blog_comments AS
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

-- Create RLS policies for the view approach instead
-- Remove the previous public policy that exposed all fields
DROP POLICY IF EXISTS "Public can view approved comments without email" ON public.blog_comments;

-- The admin/author policy is already updated and secure
-- Comments are now accessed through the view for public users
-- Admin users still access the table directly with full permissions

-- Grant appropriate permissions
GRANT SELECT ON public.public_blog_comments TO anon;
GRANT SELECT ON public.public_blog_comments TO authenticated;