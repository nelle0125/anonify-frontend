// src/components/Feed/HomeFeed.jsx
import React, { useState, useEffect, useRef } from "react";
import PostItem from "./PostItem";
import defaultAvatar from "../../assets/default-avatar.png";
import { FiImage, FiSmile, FiX, FiBarChart2 } from "react-icons/fi";
import EmojiPicker from "emoji-picker-react";

export default function HomeFeed({ currentUser }) {
  const [posts, setPosts] = useState([]);
  const [newPostText, setNewPostText] = useState("");
  const [newPostImage, setNewPostImage] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showPoll, setShowPoll] = useState(false);
  const [notif, setNotif] = useState(null); // notification state

  // Poll features
  const [pollOptions, setPollOptions] = useState(["", ""]);
  const [pollDuration, setPollDuration] = useState("1d");
  const [visibility, setVisibility] = useState("everyone");
  const feedRef = useRef(null);

  /** Emoji selection */
  const onEmojiClick = ({ emoji }) => setNewPostText((prev) => prev + emoji);

  /** Handle image upload */
  const handleImageUpload = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const imageUrl = URL.createObjectURL(file);
      setNewPostImage(imageUrl);
      return () => URL.revokeObjectURL(imageUrl);
    }
  };

  /** Remove image preview */
  const removeImage = () => setNewPostImage(null);

  /** Poll management */
  const addPollOption = () => {
    if (pollOptions.length < 4) setPollOptions([...pollOptions, ""]);
  };
  const updatePollOption = (i, val) => {
    const updated = [...pollOptions];
    updated[i] = val;
    setPollOptions(updated);
  };
  const removePollOption = (i) => {
    if (pollOptions.length > 2) {
      setPollOptions(pollOptions.filter((_, idx) => idx !== i));
    }
  };
  const resetPoll = () => {
    setPollOptions(["", ""]);
    setPollDuration("1d");
    setShowPoll(false);
  };

  /** Create post */
  const handleCreatePost = () => {
    const hasPoll = showPoll && pollOptions.some((o) => o.trim());
    if (!newPostText.trim() && !newPostImage && !hasPoll) return;

    const newPost = {
      id: Date.now(),
      user: {
        handle: currentUser?.handle || "anon_user",
        avatar: currentUser?.avatar || defaultAvatar,
      },
      content: newPostText.trim(),
      image: newPostImage || null,
      poll: hasPoll
        ? {
            options: pollOptions.filter((o) => o.trim()),
            duration: pollDuration,
            votes: [],
          }
        : null,
      visibility,
      likes: [],
      comments: [],
      reposts: [],
      createdAt: Date.now(),
      showComments: false,
      isRepost: false,
      originalUser: null,
    };

    setPosts((prev) => [newPost, ...prev]);
    setNewPostText("");
    setNewPostImage(null);
    setShowEmojiPicker(false);
    resetPoll();
    setVisibility("everyone"); // reset
  };

  /** Likes */
  const handleLike = (postId) => {
    const userHandle = currentUser?.handle || "anon_user";
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId
          ? {
              ...p,
              likes: p.likes.includes(userHandle)
                ? p.likes.filter((u) => u !== userHandle)
                : [...p.likes, userHandle],
            }
          : p
      )
    );
  };

  /** Reposts */
  const handleRepost = (postId) => {
    const userHandle = currentUser?.handle || "anon_user";

    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId
          ? {
              ...p,
              reposts: p.reposts.includes(userHandle)
                ? p.reposts.filter((u) => u !== userHandle) // undo repost
                : [...p.reposts, userHandle],
            }
          : p
      )
    );

    // Add repost notification and new post
    const originalPost = posts.find((p) => p.id === postId);
    if (originalPost && !originalPost.reposts.includes(userHandle)) {
      const repost = {
        ...originalPost,
        id: Date.now(),
        user: {
          handle: currentUser?.handle || "anon_user",
          avatar: currentUser?.avatar || defaultAvatar,
        },
        content: originalPost.content,
        likes: [],
        reposts: [],
        comments: [],
        createdAt: Date.now(),
        showComments: false,
        isRepost: true,
        originalUser: originalPost.user.handle,
      };
      setPosts((prev) => [repost, ...prev]);

      // Show notification
      setNotif(`You reposted @${originalPost.user.handle}`);
      setTimeout(() => setNotif(null), 3000);
    }
  };

  /** Comments */
  const handleAddComment = (postId, text) => {
    if (!text.trim()) return;
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId
          ? {
              ...p,
              comments: [
                ...p.comments,
                { user: currentUser, text, createdAt: Date.now() },
              ],
            }
          : p
      )
    );
  };

  /** Toggle comments */
  const handleToggleComments = (postId) => {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId ? { ...p, showComments: !p.showComments } : p
      )
    );
  };

  /** Hide emoji on scroll */
  useEffect(() => {
    const feedEl = feedRef.current;
    if (!feedEl) return;
    const handleScroll = () => setShowEmojiPicker(false);
    feedEl.addEventListener("scroll", handleScroll);
    return () => feedEl.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="home-feed" ref={feedRef}>
      {/* CREATE POST */}
      <div className="create-post">
        <div className="top-row">
          <img
            src={currentUser?.avatar || defaultAvatar}
            alt="user"
            className="avatar"
          />
          <input
            type="text"
            placeholder="What's happening?"
            value={newPostText}
            onChange={(e) => setNewPostText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleCreatePost()}
            aria-label="Post text"
          />
        </div>

        {/* Image Preview */}
        {newPostImage && (
          <div className="image-preview">
            <img src={newPostImage} alt="preview" className="preview-img" />
            <button
              className="remove-img-btn"
              onClick={removeImage}
              aria-label="Remove image"
            >
              <FiX />
            </button>
          </div>
        )}

        {/* Poll Builder */}
        {showPoll && (
          <div className="poll-builder">
            {pollOptions.map((opt, idx) => (
              <div key={idx} className="poll-option">
                <input
                  type="text"
                  placeholder={`Option ${idx + 1}`}
                  value={opt}
                  onChange={(e) => updatePollOption(idx, e.target.value)}
                  aria-label={`Poll option ${idx + 1}`}
                />
                {pollOptions.length > 2 && (
                  <button
                    onClick={() => removePollOption(idx)}
                    aria-label="Remove poll option"
                  >
                    <FiX />
                  </button>
                )}
              </div>
            ))}
            {pollOptions.length < 4 && (
              <button
                className="add-poll-btn"
                onClick={addPollOption}
                aria-label="Add poll option"
              >
                + Add option
              </button>
            )}
            <select
              value={pollDuration}
              onChange={(e) => setPollDuration(e.target.value)}
              className="poll-duration"
              aria-label="Poll duration"
            >
              <option value="1d">1 day</option>
              <option value="3d">3 days</option>
              <option value="7d">1 week</option>
            </select>
          </div>
        )}

        {/* Actions */}
        <div className="action-row">
          <div className="post-icons">
            <label className="file-upload" aria-label="Upload image">
              <FiImage />
              <input type="file" accept="image/*" onChange={handleImageUpload} />
            </label>
            <button
              className="icon-btn"
              onClick={() => setShowEmojiPicker((p) => !p)}
              aria-label="Add emoji"
            >
              <FiSmile />
            </button>
            <button
              className="icon-btn"
              onClick={() => setShowPoll((p) => !p)}
              aria-label="Toggle poll"
            >
              <FiBarChart2 />
            </button>

            {/* Visibility Dropdown */}
            <div className="dropdowns">
              <select
                value={visibility}
                onChange={(e) => setVisibility(e.target.value)}
                aria-label="Reply visibility"
              >
                <option value="everyone">Everyone</option>
                <option value="followers">Followers</option>
                <option value="mentioned">Mentioned only</option>
              </select>
            </div>
          </div>
          <button
            className="post-btn"
            onClick={handleCreatePost}
            disabled={
              !newPostText.trim() &&
              !newPostImage &&
              (!showPoll || pollOptions.every((o) => !o))
            }
          >
            Post
          </button>
        </div>

        {/* Emoji Picker */}
        {showEmojiPicker && (
          <div className="emoji-picker-wrapper">
            <EmojiPicker onEmojiClick={onEmojiClick} height={350} width="100%" theme="dark" />
          </div>
        )}
      </div>

      {/* Repost Notification */}
      {notif && <div className="repost-notif">{notif}</div>}

      {/* POSTS */}
      {posts.length === 0 ? (
        <p className="empty-feed">No posts yet.</p>
      ) : (
        posts.map((post) => (
          <PostItem
            key={post.id}
            post={post}
            currentUser={currentUser}
            onLike={handleLike}
            onRepost={handleRepost}
            onAddComment={handleAddComment}
            onToggleComments={handleToggleComments}
          />
        ))
      )}
    </div>
  );
}
