import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getBlogPostDetail, BlogPostDetail } from "../services/api";

const BACKEND_BASE_URL = "http://127.0.0.1:8000";

const BlogDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPostDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      getBlogPostDetail(slug)
        .then(setPost)
        .catch((error) => console.error("Failed to fetch post:", error))
        .finally(() => setLoading(false));
    }
  }, [slug]);

  if (loading) return <div className="text-center p-8">Loading post...</div>;
  if (!post) return <div className="text-center p-8">Post not found.</div>;

  return (
    <div className="container mx-auto p-4 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <Link
          to="/blog"
          className="text-green-600 hover:underline mb-8 inline-block"
        >
          &larr; Back to Blog
        </Link>
        <h1 className="text-4xl lg:text-5xl font-extrabold text-gray-900 mb-4">
          {post.title}
        </h1>
        <div className="text-gray-500 mb-8">
          <span>By {post.author}</span> |{" "}
          <span>
            Published on {new Date(post.created_at).toLocaleDateString()}
          </span>
        </div>
        {post.featured_image && (
          <img
            src={`${BACKEND_BASE_URL}${post.featured_image}`}
            alt={post.title}
            className="w-full h-auto rounded-lg shadow-lg mb-8"
          />
        )}
        <div
          className="prose lg:prose-xl max-w-none"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
        {/* We will add the Comment section here in the next step */}
      </div>
    </div>
  );
};

export default BlogDetailPage;
