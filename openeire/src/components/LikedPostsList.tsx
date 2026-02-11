import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getLikedBlogPosts, BlogPostListItem } from "../services/api";
import { FaHeart, FaArrowRight } from "react-icons/fa";

const BACKEND_BASE_URL = "http://127.0.0.1:8000";

const LikedPostsList: React.FC = () => {
  const [posts, setPosts] = useState<BlogPostListItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getLikedBlogPosts()
      .then((res) => setPosts(res.results))
      .catch((e) => console.error(e))
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return <div className="text-gray-500 italic">Loading favorites...</div>;

  if (posts.length === 0) {
    return (
      <div className="text-center py-20 bg-black/20 rounded-2xl border border-white/5">
        <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-600">
          <FaHeart className="text-2xl" />
        </div>
        <h3 className="text-xl font-bold text-white mb-2">
          No saved stories yet.
        </h3>
        <p className="text-gray-500 mb-6">
          Explore our journal and save your favorite articles.
        </p>
        <Link
          to="/blog"
          className="px-6 py-2 border border-white/20 rounded-full text-white hover:bg-white hover:text-black transition-colors text-sm font-bold uppercase tracking-wider"
        >
          Explore Journal
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-3xl font-serif font-bold text-white mb-8 border-b border-white/10 pb-4">
        Saved Stories
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {posts.map((post) => (
          <Link
            key={post.id}
            to={`/blog/${post.slug}`}
            className="group flex flex-col bg-black border border-white/10 rounded-xl overflow-hidden hover:border-accent/50 transition-all hover:-translate-y-1"
          >
            <div className="h-48 w-full overflow-hidden relative">
              <img
                src={
                  post.featured_image
                    ? `${BACKEND_BASE_URL}${post.featured_image}`
                    : "https://via.placeholder.com/400"
                }
                alt={post.title}
                className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
              />
              <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md p-2 rounded-full text-red-500">
                <FaHeart />
              </div>
            </div>

            <div className="p-5 flex flex-col flex-grow">
              <h3 className="font-bold text-white text-lg mb-2 line-clamp-2 group-hover:text-accent transition-colors">
                {post.title}
              </h3>
              <p className="text-sm text-gray-500 mb-4 line-clamp-2">
                {post.excerpt}
              </p>
              <div className="mt-auto flex items-center justify-between text-xs text-gray-400 font-bold uppercase tracking-wider">
                <span>{new Date(post.created_at).toLocaleDateString()}</span>
                <span className="flex items-center gap-1 group-hover:text-white transition-colors">
                  Read Story <FaArrowRight />
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default LikedPostsList;
