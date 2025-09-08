
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
  const [notif, setNotif] = useState(null);

  const [pollOptions, setPollOptions] = useState(["", ""]);
  const [pollDuration, setPollDuration] = useState("1d");
  const [visibility, setVisibility] = useState("everyone");
  const feedRef = useRef(null);

 
useEffect(() => {
  const mockPosts = [
    {
      id: 1,
      user: { handle: "alice_dev", avatar: defaultAvatar },
      content: "Excited to start using Anonify 🚀 Who’s here?",
      image: null,
      poll: null,
      visibility: "everyone",
      likes: ["anon_user", "guest42"],
      comments: [
        { user: { handle: "guest42", avatar: defaultAvatar }, text: "Welcome Alice!", createdAt: Date.now() },
        { user: { handle: "dev_guy", avatar: defaultAvatar }, text: "Happy to be here 🙌", createdAt: Date.now() },
      ],
      reposts: [],
      reports: [],
      hidden: false,
      createdAt: Date.now(),
      showComments: false,
      isRepost: false,
    },
    {
      id: 2,
      user: { handle: "guest_photos", avatar: defaultAvatar },
      content: "Check out this amazing sunset 🌅",
      image: "https://picsum.photos/600/300?random=1",
      poll: null,
      visibility: "everyone",
      likes: ["alice_dev"],
      comments: [
        { user: { handle: "anon_user", avatar: defaultAvatar }, text: "That’s beautiful!", createdAt: Date.now() },
      ],
      reposts: [],
      reports: [],
      hidden: false,
      createdAt: Date.now(),
      showComments: false,
      isRepost: false,
    },
    {
      id: 3,
      user: { handle: "nature_lover", avatar: defaultAvatar },
      content: "Morning hike vibes 🌲 Feeling refreshed!",
      image: "https://picsum.photos/600/300?random=2",
      poll: null,
      visibility: "everyone",
      likes: ["guest_photos"],
      comments: [],
      reposts: [],
      reports: [],
      hidden: false,
      createdAt: Date.now(),
      showComments: false,
      isRepost: false,
    },
    {
      id: 4,
      user: { handle: "foodie123", avatar: defaultAvatar },
      content: "Homemade pasta dinner 🍝 The recipe is a secret 😉",
      image: "https://picsum.photos/600/300?random=3",
      poll: null,
      visibility: "everyone",
      likes: ["anon_user", "nature_lover"],
      comments: [{ user: { handle: "guest42", avatar: defaultAvatar }, text: "Looks delicious!", createdAt: Date.now() }],
      reposts: [],
      reports: [],
      hidden: false,
      createdAt: Date.now(),
      showComments: false,
      isRepost: false,
    },
    {
      id: 5,
      user: { handle: "travel_bug", avatar: defaultAvatar },
      content: "Exploring the city streets 🏙️ Found some hidden gems!",
      image: "https://picsum.photos/600/300?random=4",
      poll: null,
      visibility: "everyone",
      likes: ["foodie123"],
      comments: [],
      reposts: [],
      reports: [],
      hidden: false,
      createdAt: Date.now(),
      showComments: false,
      isRepost: false,
    },
    {
      id: 6,
      user: { handle: "poll_master", avatar: defaultAvatar },
      content: "Which framework do you prefer for frontend?",
      image: null,
      poll: {
        options: ["React", "Vue", "Svelte", "Angular"],
        duration: "3d",
        votes: [
          { user: "anon_user", option: "React" },
          { user: "guest42", option: "Vue" },
        ],
      },
      visibility: "everyone",
      likes: ["alice_dev"],
      comments: [],
      reposts: [],
      reports: [],
      hidden: false,
      createdAt: Date.now(),
      showComments: false,
      isRepost: false,
    },
  ];

  
  const users = ["coder99", "traveler42", "photogirl", "chefMike", "gamerX", "bookworm", "natureFan"];
  const sampleComments = [
    "Amazing!", "Love this post 😍", "Great picture!", "Interesting...", "I totally agree!", "Wow!", "Looks fun!"
  ];

  for (let i = 7; i <= 20; i++) {
    const randomUser = users[Math.floor(Math.random() * users.length)];
    const randomCommentsCount = Math.floor(Math.random() * 3);
    const comments = Array.from({ length: randomCommentsCount }, () => ({
      user: { handle: users[Math.floor(Math.random() * users.length)], avatar: defaultAvatar },
      text: sampleComments[Math.floor(Math.random() * sampleComments.length)],
      createdAt: Date.now(),
    }));

    mockPosts.push({
      id: i,
      user: { handle: randomUser, avatar: defaultAvatar },
      content: `Random post content #${i} ✨ Loving the vibes today!`,
      image: Math.random() > 0.5 ? `https://picsum.photos/600/300?random=${i}` : null,
      poll: Math.random() > 0.85 ? { options: ["Yes", "No"], duration: "2d", votes: [] } : null,
      visibility: "everyone",
      likes: Array.from({ length: Math.floor(Math.random() * 5) }, () => users[Math.floor(Math.random() * users.length)]),
      comments,
      reposts: [],
      reports: [],
      hidden: false,
      createdAt: Date.now(),
      showComments: false,
      isRepost: false,
    });
  }

  setPosts(mockPosts);
}, []);






  const onEmojiClick = ({ emoji }) => setNewPostText((prev) => prev + emoji);


  const handleImageUpload = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const imageUrl = URL.createObjectURL(file);
      setNewPostImage(imageUrl);
      return () => URL.revokeObjectURL(imageUrl);
    }
  };
  const removeImage = () => setNewPostImage(null);


  const addPollOption = () => pollOptions.length < 4 && setPollOptions([...pollOptions, ""]);
  const updatePollOption = (i, val) => {
    const updated = [...pollOptions];
    updated[i] = val;
    setPollOptions(updated);
  };
  const removePollOption = (i) => pollOptions.length > 2 && setPollOptions(pollOptions.filter((_, idx) => idx !== i));
  const resetPoll = () => {
    setPollOptions(["", ""]);
    setPollDuration("1d");
    setShowPoll(false);
  };


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
      poll: hasPoll ? { options: pollOptions.filter((o) => o.trim()), duration: pollDuration, votes: [] } : null,
      visibility,
      likes: [],
      comments: [],
      reposts: [],
      reports: [],
      hidden: false,
      createdAt: Date.now(),
      showComments: false,
      isRepost: false,
    };

    setPosts((prev) => [newPost, ...prev]);
    setNewPostText("");
    setNewPostImage(null);
    setShowEmojiPicker(false);
    resetPoll();
    setVisibility("everyone");
  };


  const handleLike = (postId) => {
    const userHandle = currentUser?.handle || "anon_user";
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId
          ? { ...p, likes: p.likes.includes(userHandle) ? p.likes.filter((u) => u !== userHandle) : [...p.likes, userHandle] }
          : p
      )
    );
  };


  const handleRepost = (postId) => {
    const userHandle = currentUser?.handle || "anon_user";
    const targetPost = posts.find((p) => p.id === postId);
    if (!targetPost) return;
    const originalPostId = targetPost.isRepost ? targetPost.originalPostId : targetPost.id;
    const originalPost = posts.find((p) => p.id === originalPostId);
    if (!originalPost) return;

    setPosts((prev) =>
      prev.map((p) =>
        p.id === originalPostId
          ? {
              ...p,
              reposts: p.reposts.includes(userHandle)
                ? p.reposts.filter((u) => u !== userHandle)
                : [...p.reposts, userHandle],
            }
          : p
      )
    );

    if (!originalPost.reposts.includes(userHandle)) {
      const repost = {
        ...originalPost,
        id: Date.now(),
        user: { handle: currentUser?.handle || "anon_user", avatar: currentUser?.avatar || defaultAvatar },
        likes: [],
        reposts: [],
        comments: [],
        createdAt: Date.now(),
        showComments: false,
        isRepost: true,
        originalUser: originalPost.user.handle,
        originalPostId: originalPost.id,
        reports: [],
        hidden: false,
      };
      setPosts((prev) => [repost, ...prev]);
      setNotif({ message: `You reposted @${originalPost.user.handle}`, type: "repost" });
      setTimeout(() => setNotif(null), 3000);
    }
  };


  const handleAddComment = (postId, text) => {
    if (!text.trim()) return;
    setPosts((prev) =>
      prev.map((p) => (p.id === postId ? { ...p, comments: [...p.comments, { user: currentUser, text, createdAt: Date.now() }] } : p))
    );
  };


  const handleToggleComments = (postId) => {
    setPosts((prev) => prev.map((p) => (p.id === postId ? { ...p, showComments: !p.showComments } : p)));
  };


  const handleVote = (postId, option) => {
    const userHandle = currentUser?.handle || "anon_user";
    setPosts((prev) =>
      prev.map((p) => {
        const originalId = prev.find((post) => post.id === postId)?.originalPostId;
        const isTarget = p.id === postId || p.id === originalId;
        if (!isTarget || !p.poll) return p;
        if (p.poll.votes.some((v) => v.user === userHandle)) return p;
        return { ...p, poll: { ...p.poll, votes: [...p.poll.votes, { user: userHandle, option }] } };
      })
    );
  };


  const handleReport = (postId) => {
    const userHandle = currentUser?.handle || "anon_user";
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id !== postId) return p;
        if (p.reports?.includes(userHandle)) return p;
        const newReports = [...(p.reports || []), userHandle];
        return { ...p, reports: newReports, hidden: newReports.length >= 100 };
      })
    );
    setNotif({ message: "You reported this post", type: "report" });
    setTimeout(() => setNotif(null), 3000);
  };


  const handleDelete = (postId) => setPosts((prev) => prev.filter((p) => p.id !== postId));


  useEffect(() => {
    const feedEl = feedRef.current;
    if (!feedEl) return;
    const handleScroll = () => setShowEmojiPicker(false);
    feedEl.addEventListener("scroll", handleScroll);
    return () => feedEl.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="home-feed" ref={feedRef}>
      
      <div className="create-post">
        <div className="top-row">
          <img src={currentUser?.avatar || defaultAvatar} alt="user" className="avatar" />
          <input
            type="text"
            placeholder="What's happening?"
            value={newPostText}
            onChange={(e) => setNewPostText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleCreatePost()}
            aria-label="Post text"
          />
        </div>

        {newPostImage && (
          <div className="image-preview">
            <img src={newPostImage} alt="preview" className="preview-img" />
            <button className="remove-img-btn" onClick={removeImage} aria-label="Remove image">
              <FiX />
            </button>
          </div>
        )}

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
                  <button onClick={() => removePollOption(idx)} aria-label="Remove poll option">
                    <FiX />
                  </button>
                )}
              </div>
            ))}
            {pollOptions.length < 4 && (
              <button className="add-poll-btn" onClick={addPollOption} aria-label="Add poll option">
                + Add option
              </button>
            )}
            <select value={pollDuration} onChange={(e) => setPollDuration(e.target.value)} className="poll-duration">
              <option value="1d">1 day</option>
              <option value="3d">3 days</option>
              <option value="7d">1 week</option>
            </select>
          </div>
        )}

        <div className="action-row">
          <div className="post-icons">
            <label className="file-upload" aria-label="Upload image">
              <FiImage />
              <input type="file" accept="image/*" onChange={handleImageUpload} />
            </label>
            <button className="icon-btn" onClick={() => setShowEmojiPicker((p) => !p)} aria-label="Add emoji">
              <FiSmile />
            </button>
            <button className="icon-btn" onClick={() => setShowPoll((p) => !p)} aria-label="Toggle poll">
              <FiBarChart2 />
            </button>
            <div className="dropdowns">
              <select value={visibility} onChange={(e) => setVisibility(e.target.value)}>
                <option value="everyone">Everyone</option>
                <option value="followers">Followers</option>
                <option value="mentioned">Mentioned only</option>
              </select>
            </div>
          </div>
          <button
            className="post-btn"
            onClick={handleCreatePost}
            disabled={!newPostText.trim() && !newPostImage && (!showPoll || pollOptions.every((o) => !o))}
          >
            Post
          </button>
        </div>

        {showEmojiPicker && (
          <div className="emoji-picker-wrapper">
            <EmojiPicker onEmojiClick={onEmojiClick} height={350} width="100%" theme="dark" />
          </div>
        )}
      </div>

      
      {notif && <div className={`notif-popup ${notif.type}`}>{notif.message}</div>}

      
      {posts.filter((p) => !p.hidden).length === 0 ? (
        <p className="empty-feed">No posts yet.</p>
      ) : (
        posts
          .filter((p) => !p.hidden)
          .map((post) => (
            <PostItem
              key={post.id}
              post={post}
              posts={posts}
              currentUser={currentUser}
              onLike={handleLike}
              onRepost={handleRepost}
              onAddComment={handleAddComment}
              onToggleComments={handleToggleComments}
              onVote={handleVote}
              onReport={handleReport}
              onDelete={handleDelete}
            />
          ))
      )}
    </div>
  );
}
