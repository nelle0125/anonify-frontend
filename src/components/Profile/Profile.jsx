// src/components/Profile/Profile.jsx
import React, { useState, useRef } from "react";
import HomeFeed from "../Feed/HomeFeed"; // reuse HomeFeed create post
import "./profile.scss";

const Profile = ({ currentUser }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [bio, setBio] = useState(currentUser.bio || "");
  const [following, setFollowing] = useState(false);
  const [followersCount, setFollowersCount] = useState(currentUser.followers || 0);
  const [userPosts, setUserPosts] = useState(currentUser.posts || []);
  const feedRef = useRef(null);

  const handleSaveBio = () => setIsEditing(false);

  const toggleFollow = () => {
    setFollowersCount(prev => following ? Math.max(prev - 1, 0) : prev + 1);
    setFollowing(!following);
  };

  const handleNewPost = (newPost) => {
    setUserPosts(prev => [newPost, ...prev]);
  };

  return (
    <div className="profile-page">
      {/* Header */}
      <div className="profile-header">
        <div className="avatar-wrapper">
          <img
            src={currentUser.avatar || "/default-avatar.png"}
            alt="avatar"
            className="avatar"
          />
        </div>

        <div className="profile-info">
          <div className="username">@{currentUser.handle}</div>

          {isEditing ? (
            <div className="bio-edit-wrapper">
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                maxLength={150}
                placeholder="Write something about yourself..."
              />
              <div className="bio-actions">
                <button className="save-btn" onClick={handleSaveBio}>Save</button>
                <button className="cancel-btn" onClick={() => setIsEditing(false)}>Cancel</button>
              </div>
            </div>
          ) : (
            <div className="bio">
              {bio || "No bio yet."}
              <button className="edit-bio-btn" onClick={() => setIsEditing(true)}>Edit</button>
            </div>
          )}

          <div className="profile-actions">
            <button
              className={`follow-btn ${following ? "following" : ""}`}
              onClick={toggleFollow}
            >
              {following ? "Following" : "Follow"}
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="profile-stats">
        <div className="stat">
          <div className="count">{followersCount}</div>
          <div className="label">Followers</div>
        </div>
        <div className="stat">
          <div className="count">{currentUser.following || 0}</div>
          <div className="label">Following</div>
        </div>
      </div>

      {/* Feed */}
      <div className="profile-feed-wrapper" ref={feedRef}>
        {/* Create Post & Emoji Picker */}
        <HomeFeed currentUser={currentUser} onNewPost={handleNewPost} />

        {/* User posts */}
        {userPosts.length > 0 && userPosts.map(post => (
          <div key={post.id} className="post-item">
            <div className="post-content">{post.content}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Profile;
