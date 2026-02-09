// src/components/LikedPostsList.tsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getLikedBlogPosts, BlogPostListItem } from "../services/api";

const BACKEND_BASE_URL = "http://127.0.0.1:8000";

const LikedPostsList: React.FC = () => {
  const [posts, setPosts] = useState<BlogPostListItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getLikedBlogPosts()
      .then((response) => setPosts(response.results))
      .catch((error) => console.error("Failed to fetch liked posts", error))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="text-gray-500">Loading your favorites...</div>;
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-10 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-medium text-gray-900">
          No liked posts yet.
        </h3>
        <p className="text-gray-500 mb-4">
          Go explore our blog and find something you love!
        </p>
        <Link to="/blog" className="text-green-600 font-bold hover:underline">
          Browse Articles &rarr;
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-bold mb-6">My Saved Posts</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {posts.map((post) => (
          <Link
            key={post.id}
            to={`/blog/${post.slug}`}
            className="flex flex-col bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
          >
            {/* Thumbnail */}
            <div className="h-40 w-full bg-gray-100 relative">
              <img
                src={
                  post.featured_image
                    ? `${BACKEND_BASE_URL}${post.featured_image}`
                    : "https://via.placeholder.com/400x300"
                }
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Content */}
            <div className="p-4 flex flex-col flex-grow">
              <h3 className="font-bold text-gray-800 mb-2 line-clamp-1">
                {post.title}
              </h3>
              <p className="text-sm text-gray-500 mb-4 line-clamp-2">
                {post.excerpt}
              </p>

              <div className="mt-auto flex items-center justify-between text-xs text-gray-400">
                <span>{new Date(post.created_at).toLocaleDateString()}</span>
                <span className="flex items-center text-red-400">
                  <svg
                    className="w-4 h-4 mr-1 fill-current"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                  </svg>
                  Liked
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
