import React, { useState, useEffect } from "react";
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
  posts,
  onLike,
  onRepost,
  onAddComment,
  onToggleComments,
  onReport,
  onDelete,
  onVote,
  isEmbedded = false,
}) {
  const [showOptions, setShowOptions] = useState(false);
  const [userVote, setUserVote] = useState(null);

  const userHandle = currentUser?.handle || "anon_user";
  const likes = post.likes || [];
  const reposts = post.reposts || [];
  const comments = post.comments || [];

  const liked = likes.includes(userHandle);
  const reposted = reposts.includes(userHandle);

  
  const originalPost = post.originalPostId
    ? posts.find((p) => p.id === post.originalPostId)
    : null;

  
  const pollData = originalPost?.poll || post.poll;
  const pollVotes = originalPost?.poll?.votes || post.poll?.votes || [];

  
  useEffect(() => {
    const existingVote = pollVotes.find((v) => v.user === userHandle);
    if (existingVote) setUserVote(existingVote.option);
  }, [pollVotes, userHandle]);

  
  const handleVote = (option) => {
    if (!pollData || userVote) return;
    setUserVote(option);
    onVote?.(post.id, option);
  };

  const pollResults = () => {
    if (!pollData) return [];
    const totalVotes = pollVotes.length;
    return pollData.options.map((opt) => {
      const votesForOpt = pollVotes.filter((v) => v.option === opt).length;
      const percent = totalVotes ? Math.round((votesForOpt / totalVotes) * 100) : 0;
      return { option: opt, percent, votes: votesForOpt };
    });
  };

  
  const handleLike = () => onLike?.(post.id);
  const handleRepost = () => onRepost?.(post.id);
  const handleToggleComments = () => onToggleComments?.(post.id);

  const handleReport = () => {
    setShowOptions(false);
    onReport?.(post.id);
  };

  const handleDelete = () => {
    setShowOptions(false);
    onDelete?.(post.id);
  };

  
  const timeAgo = (timestamp) => {
    if (!timestamp) return "";
    const diff = Math.floor((Date.now() - new Date(timestamp)) / 1000);
    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  return (
    <article className={`post-item ${isEmbedded ? "embedded" : ""}`}>
      
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

            {post.isRepost && originalPost && (
              <div className="repost-info">
                <small>@{post.user.handle} reposted @{originalPost.user.handle}</small>
              </div>
            )}
          </div>
        </div>

        
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
                <button onClick={handleDelete}>Delete Post</button>
              )}
            </div>
          )}
        </div>
      </div>

      
      <div className="post-body">
        {originalPost ? (
          <PostItem
            post={originalPost}
            currentUser={currentUser}
            posts={posts}
            onLike={onLike}
            onRepost={onRepost}
            onAddComment={onAddComment}
            onToggleComments={onToggleComments}
            onReport={onReport}
            onVote={onVote}
            isEmbedded={true}
          />
        ) : (
          <>
            {post.content && <p className="post-content">{post.content}</p>}
            {post.image && <img src={post.image} alt="post" className="post-image" />}
            {pollData && (
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
                  {pollVotes.length} votes · ends in {pollData.duration}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      
      {!isEmbedded && (
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
      )}

      {!isEmbedded && post.showComments && (
        <CommentList
          comments={comments}
          addComment={(text) => onAddComment?.(post.id, text)}
          currentUser={currentUser}
        />
      )}
    </article>
  );
}
