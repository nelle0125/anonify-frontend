// src/components/Feed/PostItem.jsx
import React, { useState } from "react";
import {
  FiHeart,
  FiMessageCircle,
  FiRepeat,
  FiMoreHorizontal,
} from "react-icons/fi";
import CommentList from "./CommentList";
import defaultAvatar from "../../assets/default-avatar.png";

export default function PostItem({
  post,
  currentUser,
  onLike,
  onRepost,
  onAddComment,
  onToggleComments,
  onReport,
}) {
  const [showOptions, setShowOptions] = useState(false);
  const [userVote, setUserVote] = useState(null);
  const [votes, setVotes] = useState(post.poll?.votes || []);

  const userHandle = currentUser?.handle || "anon_user";
  const likes = post.likes || [];
  const reposts = post.reposts || [];
  const comments = post.comments || [];

  const liked = likes.includes(userHandle);
  const reposted = reposts.includes(userHandle);

  /** Event Handlers */
  const handleLike = () => onLike?.(post.id);
  const handleRepost = () => onRepost?.(post.id);
  const handleToggleComments = () => onToggleComments?.(post.id);
  const handleReport = () => {
    setShowOptions(false);
    onReport?.(post.id);
  };

  /** Poll voting */
  const handleVote = (option) => {
    if (!post.poll || userVote) return; // prevent multiple votes
    setUserVote(option);
    setVotes((prev) => [...prev, { user: userHandle, option }]);
  };

  /** Time formatter */
  const timeAgo = (timestamp) => {
    if (!timestamp) return "";
    const diff = Math.floor((Date.now() - new Date(timestamp)) / 1000);
    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  /** Poll percentages */
  const pollResults = () => {
    if (!post.poll) return [];
    const totalVotes = votes.length;
    return post.poll.options.map((opt) => {
      const votesForOpt = votes.filter((v) => v.option === opt).length;
      const percent = totalVotes ? Math.round((votesForOpt / totalVotes) * 100) : 0;
      return { option: opt, percent, votes: votesForOpt };
    });
  };

  return (
    <article className="post-item">
      {/* HEADER */}
      <div className="post-header">
        <div className="post-user">
          <img
            src={post.user?.avatar || defaultAvatar}
            alt={post.user?.handle || "anon_user"}
            className="avatar"
          />
          <div className="user-info">
            <span className="post-username">@{post.user?.handle || "anon_user"}</span>
            <span className="post-time">
              {timeAgo(post.createdAt)} · 👁 {post.visibility || "everyone"}
            </span>
            {/* Show repost info if applicable */}
            {post.isRepost && post.originalUser && (
              <div className="repost-info">
                <small>@{post.user.handle} reposted @{post.originalUser}</small>
              </div>
            )}
          </div>
        </div>

        {/* Options Dropdown */}
        <div className="post-options-wrapper">
          <button
            className="post-options"
            onClick={() => setShowOptions((prev) => !prev)}
            aria-label="Post options"
          >
            <FiMoreHorizontal />
          </button>
          {showOptions && (
            <div className="post-options-menu">
              <button onClick={handleReport}>Report Post</button>
              {post.user?.handle === userHandle && (
                <button onClick={() => alert("Delete functionality here")}>
                  Delete Post
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* BODY */}
      <div className="post-body">
        {post.content && <p className="post-content">{post.content}</p>}
        {post.image && <img src={post.image} alt="post" className="post-image" />}

        {/* Polls */}
        {post.poll && (
          <div className="post-poll">
            {pollResults().map(({ option, percent, votes: count }) => (
              <div
                key={option}
                className={`poll-option ${userVote === option ? "voted" : ""}`}
                onClick={() => handleVote(option)}
                role="button"
                tabIndex={0}
                aria-label={`Vote for ${option}`}
                aria-disabled={!!userVote}
              >
                <div className="poll-bar-wrapper">
                  <div className="poll-bar" style={{ width: `${percent}%` }} />
                </div>
                <div className="poll-content">
                  <span className="poll-text">{option}</span>
                  {userVote && <span className="poll-stats">{percent}% ({count})</span>}
                </div>
              </div>
            ))}
            <div className="poll-meta">
              {votes.length} votes · ends in {post.poll.duration}
            </div>
          </div>
        )}
      </div>

      {/* ACTIONS */}
      <div className="post-actions">
        <button
          className="action commenting"
          onClick={handleToggleComments}
          aria-label="Toggle comments"
        >
          <FiMessageCircle /> <span>{comments.length}</span>
        </button>

        <button
          className={`action reposting ${reposted ? "reposted" : ""}`}
          onClick={handleRepost}
          aria-label="Repost"
        >
          <FiRepeat /> <span>{reposts.length}</span>
        </button>

        <button
          className={`action liking ${liked ? "liked" : ""}`}
          onClick={handleLike}
          aria-label="Like"
        >
          <FiHeart /> <span>{likes.length}</span>
        </button>
      </div>

      {/* COMMENTS */}
      {post.showComments && (
        <CommentList
          comments={comments}
          addComment={(text) => onAddComment?.(post.id, text)}
          currentUser={currentUser}
        />
      )}
    </article>
  );
}
