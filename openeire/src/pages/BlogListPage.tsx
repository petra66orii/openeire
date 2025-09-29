import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getBlogPosts, BlogPostListItem } from "../services/api";

const BACKEND_BASE_URL = "http://127.0.0.1:8000";

const BlogPostCard: React.FC<{ post: BlogPostListItem }> = ({ post }) => (
  <Link
    to={`/blog/${post.slug}`}
    className="block group overflow-hidden rounded-lg shadow-lg"
  >
    <div className="relative h-48 w-full overflow-hidden">
      <img
        src={
          post.featured_image
            ? `${BACKEND_BASE_URL}${post.featured_image}`
            : "https://via.placeholder.com/400x300?text=OpenEire"
        }
        alt={post.title}
        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
      />
    </div>
    <div className="bg-white p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-2">{post.title}</h2>
      <p className="text-gray-600 text-sm mb-4">{post.excerpt}</p>
      <div className="text-xs text-gray-500">
        By {post.author} on {new Date(post.created_at).toLocaleDateString()}
      </div>
    </div>
  </Link>
);

const BlogListPage: React.FC = () => {
  const [posts, setPosts] = useState<BlogPostListItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getBlogPosts()
      .then((response) => setPosts(response.results))
      .catch((error) => console.error("Failed to fetch blog posts:", error))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-center p-8">Loading posts...</div>;

  return (
    <div className="container mx-auto p-4 lg:p-8">
      <h1 className="text-4xl font-bold mb-8 text-center">The OpenEire Blog</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.map((post) => (
          <BlogPostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
};

export default BlogListPage;
