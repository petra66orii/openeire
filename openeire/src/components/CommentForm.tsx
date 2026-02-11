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
      <div className="text-center p-6 border border-dashed border-white/10 rounded-xl bg-white/5">
        <p className="text-gray-400">
          Please{" "}
          <Link to="/login" className="text-accent hover:underline font-bold">
            log in
          </Link>{" "}
          to leave a comment.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="relative">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={3}
        className="w-full bg-black border border-white/20 rounded-xl p-4 text-white placeholder-gray-600 focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all resize-none"
        placeholder="Share your thoughts..."
        required
      />
      <div className="flex justify-end mt-3">
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 bg-accent text-black font-bold rounded-lg hover:bg-white transition-colors disabled:opacity-50 text-sm"
        >
          {loading ? "Posting..." : "Post Comment"}
        </button>
      </div>
    </form>
  );
};

export default CommentForm;
