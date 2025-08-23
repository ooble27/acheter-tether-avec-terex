-- Drop the problematic view
DROP VIEW IF EXISTS public.blog_comments_public;

-- Create a function that returns safe comment data (without emails)
CREATE OR REPLACE FUNCTION public.get_public_comments(post_id_filter uuid DEFAULT NULL)
RETURNS TABLE (
    id uuid,
    post_id uuid,
    parent_id uuid,
    author_name text,
    content text,
    is_approved boolean,
    created_at timestamptz,
    updated_at timestamptz
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT 
        bc.id,
        bc.post_id,
        bc.parent_id,
        bc.author_name,
        bc.content,
        bc.is_approved,
        bc.created_at,
        bc.updated_at
    FROM blog_comments bc
    WHERE bc.is_approved = true
    AND (post_id_filter IS NULL OR bc.post_id = post_id_filter)
    ORDER BY bc.created_at DESC;
$$;

-- Grant execute permission on the function
GRANT EXECUTE ON FUNCTION public.get_public_comments TO anon;
GRANT EXECUTE ON FUNCTION public.get_public_comments TO authenticated;

-- Now the blog_comments table is only accessible to:
-- 1. Admins (full access)
-- 2. Comment authors (their own comments with full access)
-- Public users must use the get_public_comments function which excludes emails