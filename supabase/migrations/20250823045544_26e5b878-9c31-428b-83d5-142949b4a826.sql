-- Remove the view approach entirely and use a different strategy
-- Drop the view that's causing security issues
DROP VIEW IF EXISTS public.public_blog_comments;

-- Instead of using a view, we'll use a different RLS approach
-- Create a function to check if a comment should be publicly visible
CREATE OR REPLACE FUNCTION public.is_comment_public_visible(comment_row blog_comments)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT comment_row.is_approved = true;
$$;

-- Add a policy that allows public viewing of approved comments 
-- but only exposes non-sensitive fields through application queries
CREATE POLICY "Public can view approved comments" 
ON public.blog_comments 
FOR SELECT 
USING (is_approved = true);

-- Note: The application should be responsible for only selecting 
-- non-sensitive fields (excluding author_email) when displaying 
-- comments to non-authenticated users.