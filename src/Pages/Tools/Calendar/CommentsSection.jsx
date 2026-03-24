import React, { useState, useEffect } from "react";
import { api } from "../../../services/api";

export default function CommentsSection({ postId }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editContent, setEditContent] = useState("");

  useEffect(() => {
    if (postId) {
      loadComments();
    }
  }, [postId]);

  const loadComments = async () => {
    setIsLoading(true);
    try {
      const data = await api.getPostComments(postId);
      setComments(data.comments || []);
    } catch (err) {
      console.error("Failed to load comments:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setIsSending(true);
    try {
      const data = await api.createComment(postId, { content: newComment });
      setComments((prev) => [...prev, data.comment]);
      setNewComment("");
    } catch (err) {
      console.error("Failed to add comment:", err);
      alert("Failed to add comment. Please try again.");
    } finally {
      setIsSending(false);
    }
  };

  const handleUpdateComment = async (commentId) => {
    if (!editContent.trim()) return;

    try {
      await api.updateComment(commentId, { content: editContent });
      setComments((prev) =>
        prev.map((c) =>
          c.id === commentId ? { ...c, content: editContent } : c
        )
      );
      setEditingId(null);
      setEditContent("");
    } catch (err) {
      console.error("Failed to update comment:", err);
      alert("Failed to update comment. Please try again.");
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm("Are you sure you want to delete this comment?"))
      return;

    try {
      await api.deleteComment(commentId);
      setComments((prev) => prev.filter((c) => c.id !== commentId));
    } catch (err) {
      console.error("Failed to delete comment:", err);
      alert("Failed to delete comment. Please try again.");
    }
  };

  if (!postId) {
    return (
      <div className="flex-1 flex items-center justify-center p-6 text-gray-500">
        <p className="text-sm">Select a post to view comments</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="text-center">
          <div className="w-6 h-6 border-2 border-violet-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          <p className="text-sm text-gray-500">Loading comments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Comments list */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {comments.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <svg
              className="w-12 h-12 mx-auto mb-3 opacity-50"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
            <p className="text-sm">No comments yet</p>
            <p className="text-xs mt-1">Be the first to add a comment</p>
          </div>
        ) : (
          comments.map((comment) => (
            <div
              key={comment.id}
              className="bg-gray-50 border border-gray-200 rounded-lg p-4"
            >
              {editingId === comment.id ? (
                <div>
                  <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 resize-none"
                    rows={3}
                    autoFocus
                  />
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => handleUpdateComment(comment.id)}
                      className="px-3 py-1 rounded-lg bg-violet-600 text-white text-xs hover:bg-violet-700 transition"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => {
                        setEditingId(null);
                        setEditContent("");
                      }}
                      className="px-3 py-1 rounded-lg border border-gray-200 text-gray-600 text-xs hover:bg-gray-100 transition"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {comment.userName || "Unknown User"}
                      </p>
                      <p className="text-xs text-gray-500">
                        {comment.createdAt
                          ? new Date(comment.createdAt).toLocaleString()
                          : "Just now"}
                      </p>
                    </div>
                    <div className="flex gap-1">
                      <button
                        onClick={() => {
                          setEditingId(comment.id);
                          setEditContent(comment.content);
                        }}
                        className="p-1 text-gray-400 hover:text-gray-600 transition"
                        title="Edit"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                          />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDeleteComment(comment.id)}
                        className="p-1 text-gray-400 hover:text-red-600 transition"
                        title="Delete"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">
                    {comment.content}
                  </p>
                </>
              )}
            </div>
          ))
        )}
      </div>

      {/* Add comment form */}
      <form
        onSubmit={handleAddComment}
        className="p-6 border-t border-gray-200 bg-gray-50"
      >
        <div className="mb-3">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            rows={3}
            className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 resize-none"
          />
        </div>
        <button
          type="submit"
          disabled={isSending || !newComment.trim()}
          className="w-full py-2.5 rounded-lg bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 text-white font-semibold text-sm hover:from-violet-700 hover:via-indigo-700 hover:to-cyan-600 transition disabled:opacity-50 shadow-lg shadow-violet-500/25"
        >
          {isSending ? "Sending..." : "Add Comment"}
        </button>
      </form>
    </div>
  );
}
