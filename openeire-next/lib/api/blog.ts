import { api, isApiError } from "@/lib/api/client";
import type {
  BlogLikeResponse,
  BlogComment,
  BlogPostDetail,
  BlogPostListItem,
  PaginatedResponse,
} from "@/types/blog";

const BLOG_REVALIDATE_SECONDS = 300;

export const getPublishedBlogPosts = async (
  options: { tag?: string; page?: number | string } = {},
): Promise<PaginatedResponse<BlogPostListItem>> => {
  const response = await api.get<PaginatedResponse<BlogPostListItem>>("blog/", {
    params: {
      tag: options.tag,
      page: options.page,
    },
    next: { revalidate: BLOG_REVALIDATE_SECONDS },
  });

  return response.data;
};

export const getAllPublishedBlogPostsForSitemap = async (): Promise<
  BlogPostListItem[]
> => {
  const posts: BlogPostListItem[] = [];
  let page = 1;

  while (page <= 20) {
    const response = await getPublishedBlogPosts({ page });
    posts.push(...response.results);
    if (!response.next) break;
    page += 1;
  }

  return posts;
};

export const getPublishedBlogPostBySlug = async (
  slug: string,
): Promise<BlogPostDetail | null> => {
  try {
    const response = await api.get<BlogPostDetail>(`blog/${slug}/`, {
      next: { revalidate: BLOG_REVALIDATE_SECONDS },
    });

    return response.data;
  } catch (error) {
    if (
      isApiError(error) &&
      (error.response?.status === 404 ||
        error.message.toLowerCase().includes("not found"))
    ) {
      return null;
    }
    throw error;
  }
};

export const getLikedBlogPosts = async (): Promise<
  PaginatedResponse<BlogPostListItem>
> => {
  const response = await api.get<PaginatedResponse<BlogPostListItem>>(
    "blog/liked/",
    {
      cache: "no-store",
      retryOnAuthRefresh: true,
    },
  );
  return response.data;
};

export const getBlogPostLikeState = async (
  slug: string,
): Promise<BlogLikeResponse> => {
  const response = await api.get<BlogPostDetail>(`blog/${slug}/`, {
    cache: "no-store",
    retryOnAuthRefresh: true,
  });
  return {
    liked: Boolean(response.data.has_liked),
    likes_count: response.data.likes_count,
  };
};

export const toggleBlogLike = async (
  slug: string,
): Promise<BlogLikeResponse> => {
  const response = await api.post<BlogLikeResponse>(
    `blog/${slug}/like/`,
    undefined,
    { retryOnAuthRefresh: true },
  );
  return response.data;
};

export const getBlogComments = async (
  slug: string,
  signal?: AbortSignal,
): Promise<BlogComment[]> => {
  const response = await api.get<BlogComment[]>(`blog/${slug}/comments/`, {
    cache: "no-store",
    signal,
  });
  return response.data;
};

export const postBlogComment = async (
  slug: string,
  content: string,
): Promise<BlogComment> => {
  const response = await api.post<BlogComment>(
    `blog/${slug}/comments/`,
    { content },
    {
      cache: "no-store",
      retryOnAuthRefresh: true,
    },
  );
  return response.data;
};
