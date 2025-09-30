import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  getBlogPostDetail,
  BlogPostDetail,
  getComments,
  Comment,
  postComment,
} from "../services/api";
import CommentList from "../components/CommentList";
import CommentForm from "../components/CommentForm";
import { toast } from "react-toastify";

const BACKEND_BASE_URL = "http://127.0.0.1:8000";

const BlogDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPostDetail | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      setLoading(true);
      Promise.all([getBlogPostDetail(slug), getComments(slug)])
        .then(([postData, commentsData]) => {
          setPost(postData);
          setComments(commentsData);
        })
        .catch((error) => {
          console.error("Failed to fetch post or comments:", error);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [slug]);

  const handleCommentSubmit = async (content: string) => {
    if (!slug) return;
    try {
      await postComment(slug, content);
      toast.success("Comment submitted! It will appear after approval.");
      // Optionally, you could re-fetch comments here to show the unapproved one,
      // but a success message is usually enough for an MVP.
    } catch (error: any) {
      toast.error(error?.detail || "Failed to post comment.");
    }
  };

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
        <div className="mt-12">
          <h2 className="text-3xl font-bold mb-6 border-b pb-4">Comments</h2>
          <CommentList comments={comments} />
          <CommentForm onSubmit={handleCommentSubmit} />
        </div>
      </div>
    </div>
  );
};

export default BlogDetailPage;
