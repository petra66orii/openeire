export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface BlogPostListItem {
  id: number;
  title: string;
  slug: string;
  author: string;
  featured_image: string | null;
  excerpt: string;
  meta_title: string;
  meta_description: string;
  canonical_url: string;
  created_at: string;
  tags: string[];
  likes_count: number;
  has_liked?: boolean;
}

export interface BlogLikeResponse {
  liked: boolean;
  likes_count: number;
}

export interface RelatedBlogPost {
  title: string;
  slug: string;
  featured_image: string | null;
  created_at: string;
}

export interface BlogPostDetail extends BlogPostListItem {
  content: string;
  updated_at: string;
  has_liked: boolean;
  related_posts: RelatedBlogPost[];
}
