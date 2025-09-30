import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

interface CommentFormProps {
  onSubmit: (content: string) => Promise<void>;
}

const CommentForm: React.FC<CommentFormProps> = ({ onSubmit }) => {
  const { isAuthenticated } = useAuth();
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    setLoading(true);
    await onSubmit(content);
    setLoading(false);
    setContent("");
  };

  if (!isAuthenticated) {
    return (
      <p className="text-center p-4 border-t mt-8">
        Please{" "}
        <Link
          to="/login"
          className="text-green-600 font-semibold hover:underline"
        >
          log in
        </Link>{" "}
        to leave a comment.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 border-t pt-8">
      <h3 className="text-xl font-semibold mb-4">Leave a Comment</h3>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={4}
        className="w-full p-2 border border-gray-300 rounded-md"
        placeholder="Write your comment here..."
        required
      />
      <button
        type="submit"
        disabled={loading}
        className="mt-4 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
      >
        {loading ? "Submitting..." : "Post Comment"}
      </button>
    </form>
  );
};

export default CommentForm;
