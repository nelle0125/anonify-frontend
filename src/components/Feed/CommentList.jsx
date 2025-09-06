// src/components/Feed/CommentList.jsx
import React, { useState } from "react";
import defaultAvatar from "../../assets/default-avatar.png";

export default function CommentList({ comments, addComment, currentUser }) {
  const [text, setText] = useState("");

  /** Submit new comment */
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    addComment(text.trim());
    setText("");
  };

  /** Allow Enter to submit (Shift+Enter = newline) */
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  /** Format time ago for comments */
  const timeAgo = (timestamp) => {
    if (!timestamp) return "";
    const diff = Math.floor((Date.now() - new Date(timestamp)) / 1000);
    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  return (
    <div className="comment-list">
      {/* Existing Comments */}
      {comments.map((c, index) => (
        <div key={index} className="comment-item">
          <img
            src={c.user?.avatar || defaultAvatar}
            alt={c.user?.handle || "anon_user"}
            className="avatar-sm"
          />
          <div className="comment-bubble">
            <div className="comment-header">
              <span className="comment-username">@{c.user?.handle || "anon_user"}</span>
              <span className="comment-time">{timeAgo(c.createdAt)}</span>
            </div>
            <span className="comment-text">{c.text}</span>
          </div>
        </div>
      ))}

      {/* Add New Comment */}
      <form className="comment-form" onSubmit={handleSubmit}>
        <img
          src={currentUser?.avatar || defaultAvatar}
          alt={currentUser?.handle || "anon_user"}
          className="avatar-sm"
        />
        <input
          type="text"
          placeholder="Add a comment..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          className="comment-input"
        />
        <button
          type="submit"
          className={`comment-post-btn ${!text.trim() ? "disabled" : ""}`}
          disabled={!text.trim()}
        >
          Post
        </button>
      </form>
    </div>
  );
}
