import React from "react";
import { Comment } from "../services/api";

interface CommentListProps {
  comments: Comment[];
}

const CommentList: React.FC<CommentListProps> = ({ comments }) => {
  if (comments.length === 0) {
    return (
      <p className="text-gray-500">No comments yet. Be the first to comment!</p>
    );
  }

  return (
    <div className="space-y-6">
      {comments.map((comment) => (
        <div key={comment.id} className="flex space-x-4">
          <div className="flex-shrink-0">
            {/* Placeholder for user avatar */}
            <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center font-bold text-gray-600">
              {comment.user.charAt(0).toUpperCase()}
            </div>
          </div>
          <div>
            <div className="flex items-baseline space-x-2">
              <p className="font-semibold text-gray-800">{comment.user}</p>
              <p className="text-xs text-gray-500">
                {new Date(comment.created_at).toLocaleDateString()}
              </p>
            </div>
            <p className="text-gray-700 mt-1">{comment.content}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CommentList;
