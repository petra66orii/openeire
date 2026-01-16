import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  getBlogPostDetail,
  BlogPostDetail,
  getComments,
  Comment,
  postComment,
  toggleBlogLike,
} from "../services/api";
import CommentList from "../components/CommentList";
import CommentForm from "../components/CommentForm";
import { toast } from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import SocialShareButtons from "../components/SocialShareButtons";
import SEOHead from "../components/SEOHead";

const BACKEND_BASE_URL = "http://127.0.0.1:8000";

const BlogDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { user } = useAuth(); // To check if user is logged in

  const [post, setPost] = useState<BlogPostDetail | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);

  // Like State
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  useEffect(() => {
    if (slug) {
      setLoading(true);
      Promise.all([getBlogPostDetail(slug), getComments(slug)])
        .then(([postData, commentsData]) => {
          setPost(postData);
          setComments(commentsData);
          // Initialize Like State
          setLiked(postData.has_liked ?? false);
          setLikeCount(postData.likes_count);
        })
        .catch((error) => {
          console.error("Failed to fetch post or comments:", error);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [slug]);

  const handleLike = async () => {
    if (!slug) return;
    if (!user) {
      toast.error("Please login to like this post.");
      return;
    }

    try {
      // Optimistic UI update (optional, but feels faster)
      setLiked(!liked);
      setLikeCount((prev) => (liked ? prev - 1 : prev + 1));

      const data = await toggleBlogLike(slug);

      // Sync with actual server response to be safe
      setLiked(data.liked);
      setLikeCount(data.likes_count);
    } catch (err) {
      toast.error("Failed to like post.");
      // Revert if failed
      setLiked(!liked);
    }
  };

  const handleCommentSubmit = async (content: string) => {
    if (!slug) return;
    try {
      await postComment(slug, content);
      toast.success("Comment submitted! It will appear after approval.");
    } catch (error: any) {
      toast.error(error?.detail || "Failed to post comment.");
    }
  };

  if (loading) return <div className="text-center p-8">Loading post...</div>;
  if (!post) return <div className="text-center p-8">Post not found.</div>;

  return (
    <div className="container mx-auto p-4 lg:p-8">
      <SEOHead
        title={post.title}
        description={post.excerpt || "Read this article on OpenEire Studios."}
        image={
          post.featured_image
            ? `${BACKEND_BASE_URL}${post.featured_image}`
            : undefined
        }
      />
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-sm p-8 border border-gray-100">
        {/* Breadcrumb */}
        <Link
          to="/blog"
          className="text-green-600 hover:underline mb-6 inline-flex items-center text-sm font-medium"
        >
          &larr; Back to Blog
        </Link>

        {/* Title */}
        <h1 className="text-3xl lg:text-5xl font-extrabold text-gray-900 mb-4 leading-tight">
          {post.title}
        </h1>

        {/* Meta Row: Date, Author, Tags */}
        <div className="flex flex-col md:flex-row md:items-center justify-between text-gray-500 text-sm mb-6 pb-6 border-b">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <span>
              By{" "}
              <span className="font-semibold text-gray-700">{post.author}</span>
            </span>
            <span>•</span>
            <span>{new Date(post.created_at).toLocaleDateString()}</span>
          </div>

          {/* Tags */}
          <div className="flex gap-2 flex-wrap">
            {post.tags.map((tag) => (
              <Link
                key={tag}
                to={`/blog?tag=${tag}`}
                className="bg-gray-100 hover:bg-gray-200 text-gray-600 px-3 py-1 rounded-full text-xs transition-colors"
              >
                #{tag}
              </Link>
            ))}
          </div>
        </div>

        {/* Featured Image */}
        {post.featured_image && (
          <img
            src={`${BACKEND_BASE_URL}${post.featured_image}`}
            alt={post.title}
            className="w-full h-auto rounded-xl mb-8 object-cover max-h-[500px]"
          />
        )}

        {/* Content */}
        <div
          className="prose prose-lg max-w-none prose-green text-gray-800"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Like Section */}
        <div className="mt-12 py-8 border-y flex flex-col items-center justify-center bg-gray-50 rounded-lg">
          <p className="text-gray-500 mb-3 text-sm uppercase tracking-wide font-bold">
            Did you enjoy this article?
          </p>
          <button
            onClick={handleLike}
            className={`flex items-center gap-2 px-6 py-3 rounded-full text-lg font-bold transition-all transform hover:scale-105 shadow-sm ${
              liked
                ? "bg-red-50 text-red-600 border border-red-200"
                : "bg-white text-gray-600 border border-gray-300 hover:border-red-300 hover:text-red-500"
            }`}
          >
            <svg
              className={`w-6 h-6 ${liked ? "fill-current" : "stroke-current fill-none"}`}
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
            {likeCount} Likes
          </button>
          <div className="mt-6 flex flex-col items-center">
            <p className="text-gray-500 text-xs uppercase font-bold mb-2">
              Share this post
            </p>
            <SocialShareButtons
              url={window.location.href}
              title={post.title}
              image={
                post.featured_image
                  ? `${BACKEND_BASE_URL}${post.featured_image}`
                  : undefined
              }
            />
          </div>
        </div>

        {/* RELATED POSTS SECTION */}
        {post.related_posts && post.related_posts.length > 0 && (
          <div className="mt-12 pt-10 border-t border-gray-200">
            <h3 className="text-2xl font-bold mb-6 text-gray-900">
              You Might Also Like
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {post.related_posts.map((related) => (
                <Link
                  key={related.slug}
                  to={`/blog/${related.slug}`}
                  className="group block bg-gray-50 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                >
                  {/* Thumbnail */}
                  <div className="aspect-w-16 aspect-h-9 overflow-hidden h-40 bg-gray-200">
                    <img
                      src={
                        related.featured_image
                          ? `${BACKEND_BASE_URL}${related.featured_image}`
                          : "https://via.placeholder.com/400x300?text=OpenEire"
                      }
                      alt={related.title}
                      className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  {/* Title & Date */}
                  <div className="p-4">
                    <h4 className="font-bold text-gray-800 group-hover:text-green-700 transition-colors line-clamp-2 mb-2">
                      {related.title}
                    </h4>
                    <span className="text-xs text-gray-500 block">
                      {new Date(related.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Comments Section */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Comments</h2>
          <CommentList comments={comments} />
          <div className="mt-8">
            <CommentForm onSubmit={handleCommentSubmit} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogDetailPage;
