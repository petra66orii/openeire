import React, { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { getBlogPosts, BlogPostListItem } from "../services/api";
import { FaCalendarAlt, FaUser, FaTag, FaHeart } from "react-icons/fa";

const BACKEND_BASE_URL = "http://127.0.0.1:8000";

const BlogPostCard: React.FC<{ post: BlogPostListItem }> = ({ post }) => (
  <Link
    to={`/blog/${post.slug}`}
    className="group relative flex flex-col h-full bg-gray-900 border border-white/10 rounded-2xl overflow-hidden hover:border-accent/50 transition-all duration-500 hover:-translate-y-1 shadow-lg hover:shadow-2xl"
  >
    {/* Image Section with Overlay */}
    <div className="relative h-64 w-full overflow-hidden">
      <img
        src={
          post.featured_image
            ? `${BACKEND_BASE_URL}${post.featured_image}`
            : "https://via.placeholder.com/800x600?text=OpenEire+Journal"
        }
        alt={post.title}
        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-90 group-hover:opacity-100"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent opacity-90" />

      {/* Date Badge */}
      <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 flex items-center gap-2 text-xs font-bold text-white">
        <FaCalendarAlt className="text-accent" />
        {new Date(post.created_at).toLocaleDateString(undefined, {
          month: "short",
          day: "numeric",
        })}
      </div>
    </div>

    {/* Content Section */}
    <div className="p-6 flex flex-col flex-grow">
      <div className="flex items-center gap-2 mb-3 text-xs font-bold uppercase tracking-widest text-accent">
        <FaUser /> {post.author}
      </div>

      <h2 className="text-2xl font-serif font-bold text-white mb-3 leading-tight group-hover:text-accent transition-colors">
        {post.title}
      </h2>

      <p className="text-gray-400 text-sm mb-6 flex-grow line-clamp-3 leading-relaxed">
        {post.excerpt}
      </p>

      {/* Footer: Tags & Likes */}
      <div className="mt-auto border-t border-white/10 pt-4 flex items-center justify-between">
        <div className="flex gap-2 flex-wrap">
          {post.tags.slice(0, 2).map((tag) => (
            <span
              key={tag}
              className="text-[10px] bg-white/5 border border-white/10 text-gray-300 px-2 py-1 rounded hover:bg-white/10 transition-colors"
            >
              #{tag}
            </span>
          ))}
        </div>

        <div className="flex items-center text-gray-500 text-xs font-bold gap-1 group-hover:text-red-500 transition-colors">
          <FaHeart /> {post.likes_count}
        </div>
      </div>
    </div>
  </Link>
);

const BlogListPage: React.FC = () => {
  const [posts, setPosts] = useState<BlogPostListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const currentTag = searchParams.get("tag");

  useEffect(() => {
    setLoading(true);
    getBlogPosts(currentTag || undefined)
      .then((response) => setPosts(response.results))
      .catch((error) => console.error("Failed to fetch blog posts:", error))
      .finally(() => setLoading(false));
  }, [currentTag]);

  return (
    <div className="bg-black min-h-screen text-white pt-24 pb-20">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-serif font-bold mb-6 tracking-tight">
            The Journal
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg font-light">
            Behind the scenes, photography tips, and stories from the Irish
            landscape.
          </p>

          {/* Filter Active State */}
          {currentTag && (
            <div className="mt-8 inline-flex items-center bg-accent/10 border border-accent/20 text-accent px-6 py-2 rounded-full backdrop-blur-md animate-fade-in-up">
              <FaTag className="mr-2" />
              <span>
                Filtering by: <strong>#{currentTag}</strong>
              </span>
              <Link
                to="/blog"
                className="ml-4 hover:text-white transition-colors"
                onClick={() => setSearchParams({})}
              >
                ✕
              </Link>
            </div>
          )}
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-accent"></div>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-20 border border-white/10 rounded-2xl bg-gray-900/50">
            <h3 className="text-xl font-bold text-white mb-2">
              No stories found.
            </h3>
            <p className="text-gray-500">Try clearing your filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
            {posts.map((post) => (
              <BlogPostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogListPage;
