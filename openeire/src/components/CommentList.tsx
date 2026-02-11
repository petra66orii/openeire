import React from "react";
import { Comment } from "../services/api";

interface CommentListProps {
  comments: Comment[];
}

const CommentList: React.FC<CommentListProps> = ({ comments }) => {
  if (comments.length === 0) {
    return (
      <p className="text-gray-500 italic">
        No comments yet. Start the conversation.
      </p>
    );
  }

  return (
    <div className="space-y-8">
      {comments.map((comment) => (
        <div key={comment.id} className="flex gap-4 group">
          {/* Avatar */}
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-white/10 border border-white/10 flex items-center justify-center font-bold text-accent font-serif">
            {comment.user.charAt(0).toUpperCase()}
          </div>

          <div className="flex-grow">
            <div className="flex items-baseline gap-3 mb-1">
              <span className="font-bold text-white text-sm">
                {comment.user}
              </span>
              <span className="text-xs text-gray-600 uppercase tracking-wider">
                {new Date(comment.created_at).toLocaleDateString()}
              </span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              {comment.content}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CommentList;
