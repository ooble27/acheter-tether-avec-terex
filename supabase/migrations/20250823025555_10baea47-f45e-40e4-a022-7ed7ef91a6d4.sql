-- Drop the problematic view completely since it's flagged as security definer
-- The underlying blog_comments table already has proper RLS policies
DROP VIEW IF EXISTS public.blog_comments_public;

-- Instead of using a view, we'll rely on the existing RLS policies on blog_comments table
-- which already allow users to view approved comments through proper application logic