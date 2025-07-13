
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  featured_image: string | null;
  author_name: string;
  author_avatar: string | null;
  author_bio: string | null;
  category: {
    id: string;
    name: string;
    slug: string;
    color: string;
  } | null;
  tags: Array<{
    id: string;
    name: string;
    slug: string;
  }>;
  is_featured: boolean;
  reading_time: number;
  views_count: number;
  likes_count: number;
  published_at: string;
  created_at: string;
  meta_title: string | null;
  meta_description: string | null;
}

export interface BlogCategory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  color: string;
}

export interface BlogTag {
  id: string;
  name: string;
  slug: string;
}

export const useBlogPosts = (filters?: {
  category?: string;
  tag?: string;
  search?: string;
  featured?: boolean;
  limit?: number;
  offset?: number;
}) => {
  return useQuery({
    queryKey: ['blog-posts', filters],
    queryFn: async () => {
      let query = supabase
        .from('blog_posts')
        .select(`
          *,
          category:blog_categories(id, name, slug, color),
          blog_post_tags(
            blog_tags(id, name, slug)
          )
        `)
        .eq('is_published', true)
        .order('published_at', { ascending: false });

      if (filters?.category) {
        query = query.eq('blog_categories.slug', filters.category);
      }

      if (filters?.featured) {
        query = query.eq('is_featured', true);
      }

      if (filters?.search) {
        query = query.or(`title.ilike.%${filters.search}%,excerpt.ilike.%${filters.search}%,content.ilike.%${filters.search}%`);
      }

      if (filters?.limit) {
        query = query.limit(filters.limit);
      }

      if (filters?.offset) {
        query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1);
      }

      const { data, error } = await query;

      if (error) throw error;

      return data?.map(post => ({
        ...post,
        tags: post.blog_post_tags?.map(pt => pt.blog_tags).filter(Boolean) || []
      })) as BlogPost[];
    },
  });
};

export const useBlogPost = (slug: string) => {
  return useQuery({
    queryKey: ['blog-post', slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('blog_posts')
        .select(`
          *,
          category:blog_categories(id, name, slug, color),
          blog_post_tags(
            blog_tags(id, name, slug)
          )
        `)
        .eq('slug', slug)
        .eq('is_published', true)
        .single();

      if (error) throw error;

      return {
        ...data,
        tags: data.blog_post_tags?.map(pt => pt.blog_tags).filter(Boolean) || []
      } as BlogPost;
    },
  });
};

export const useBlogCategories = () => {
  return useQuery({
    queryKey: ['blog-categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('blog_categories')
        .select('*')
        .order('name');

      if (error) throw error;
      return data as BlogCategory[];
    },
  });
};

export const useBlogTags = () => {
  return useQuery({
    queryKey: ['blog-tags'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('blog_tags')
        .select('*')
        .order('name');

      if (error) throw error;
      return data as BlogTag[];
    },
  });
};

export const useSubscribeNewsletter = () => {
  const subscribe = async (email: string) => {
    const { error } = await supabase
      .from('blog_subscriptions')
      .insert([{ email }]);

    if (error) throw error;
  };

  return { subscribe };
};
