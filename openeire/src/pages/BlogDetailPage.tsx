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
import {
  FaArrowLeft,
  FaHeart,
  FaRegHeart,
  FaCalendar,
  FaUser,
} from "react-icons/fa";

const BACKEND_BASE_URL = "http://127.0.0.1:8000";

const BlogDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { user } = useAuth();

  const [post, setPost] = useState<BlogPostDetail | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  useEffect(() => {
    if (slug) {
      setLoading(true);
      Promise.all([getBlogPostDetail(slug), getComments(slug)])
        .then(([postData, commentsData]) => {
          setPost(postData);
          setComments(commentsData);
          setLiked(postData.has_liked ?? false);
          setLikeCount(postData.likes_count);
        })
        .catch((error) => console.error("Failed to fetch post", error))
        .finally(() => setLoading(false));
    }
  }, [slug]);

  const handleLike = async () => {
    if (!slug) return;
    if (!user) {
      toast.error("Please login to like this post.");
      return;
    }
    try {
      setLiked(!liked);
      setLikeCount((prev) => (liked ? prev - 1 : prev + 1));
      const data = await toggleBlogLike(slug);
      setLiked(data.liked);
      setLikeCount(data.likes_count);
    } catch (err) {
      toast.error("Failed to like post.");
      setLiked(!liked);
    }
  };

  const handleCommentSubmit = async (content: string) => {
    if (!slug) return;
    try {
      await postComment(slug, content);
      toast.success("Comment submitted for approval.");
    } catch (error: any) {
      toast.error(error?.detail || "Failed to post comment.");
    }
  };

  if (loading)
    return (
      <div className="bg-black min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-accent"></div>
      </div>
    );
  if (!post)
    return (
      <div className="bg-black min-h-screen text-white flex items-center justify-center">
        Post not found.
      </div>
    );

  return (
    <div className="bg-black min-h-screen text-white pt-24 pb-20">
      <SEOHead
        title={post.title}
        description={post.excerpt}
        image={
          post.featured_image
            ? `${BACKEND_BASE_URL}${post.featured_image}`
            : undefined
        }
      />

      {/* HERO SECTION */}
      <div className="container mx-auto px-4 lg:px-8 max-w-4xl">
        <Link
          to="/blog"
          className="inline-flex items-center text-gray-500 hover:text-accent transition-colors mb-8 text-sm font-bold uppercase tracking-widest"
        >
          <FaArrowLeft className="mr-2" /> Back to Journal
        </Link>

        <h1 className="text-4xl md:text-6xl font-serif font-bold mb-6 leading-tight text-white">
          {post.title}
        </h1>

        <div className="flex flex-wrap items-center gap-6 text-sm text-gray-400 mb-8 font-mono border-b border-white/10 pb-8">
          <div className="flex items-center gap-2">
            <FaUser className="text-accent" /> {post.author}
          </div>
          <div className="flex items-center gap-2">
            <FaCalendar className="text-accent" />{" "}
            {new Date(post.created_at).toLocaleDateString()}
          </div>
          <div className="flex gap-2">
            {post.tags.map((tag) => (
              <Link
                key={tag}
                to={`/blog?tag=${tag}`}
                className="text-accent hover:underline"
              >
                #{tag}
              </Link>
            ))}
          </div>
        </div>

        {post.featured_image && (
          <div className="rounded-2xl overflow-hidden border border-white/10 mb-12 shadow-2xl">
            <img
              src={`${BACKEND_BASE_URL}${post.featured_image}`}
              alt={post.title}
              className="w-full h-auto"
            />
          </div>
        )}

        {/* CONTENT (Use prose-invert for dark mode) */}
        <article className="prose prose-invert prose-lg max-w-none text-gray-300 leading-loose prose-a:text-accent prose-headings:font-serif prose-headings:text-white prose-blockquote:border-l-accent prose-img:rounded-xl">
          <div dangerouslySetInnerHTML={{ __html: post.content }} />
        </article>

        {/* ACTIONS */}
        <div className="mt-16 pt-8 border-t border-white/10 flex flex-col items-center">
          <button
            onClick={handleLike}
            className={`flex items-center gap-3 px-8 py-4 rounded-full text-lg font-bold transition-all transform active:scale-95 mb-8 ${
              liked
                ? "bg-red-500/20 text-red-500 border border-red-500/50"
                : "bg-white/5 text-gray-400 border border-white/10 hover:border-white/30 hover:text-white"
            }`}
          >
            {liked ? <FaHeart /> : <FaRegHeart />}
            <span>{likeCount} Likes</span>
          </button>

          <div className="text-center">
            <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-4">
              Share this story
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

        {/* RELATED POSTS */}
        {post.related_posts && post.related_posts.length > 0 && (
          <div className="mt-20 pt-10 border-t border-white/10">
            <h3 className="text-2xl font-serif font-bold text-white mb-8">
              Read Next
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {post.related_posts.map((related) => (
                <Link
                  key={related.slug}
                  to={`/blog/${related.slug}`}
                  className="group block bg-gray-900 border border-white/10 rounded-xl overflow-hidden hover:border-accent/50 transition-all"
                >
                  <div className="h-40 overflow-hidden relative">
                    <img
                      src={
                        related.featured_image
                          ? `${BACKEND_BASE_URL}${related.featured_image}`
                          : "https://via.placeholder.com/400"
                      }
                      className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                    />
                  </div>
                  <div className="p-4">
                    <h4 className="font-bold text-white text-lg leading-tight group-hover:text-accent transition-colors">
                      {related.title}
                    </h4>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* COMMENTS */}
        <div className="mt-20 bg-gray-900/50 border border-white/5 rounded-2xl p-8">
          <h3 className="text-2xl font-serif font-bold text-white mb-8">
            Discussion
          </h3>
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
