// src/pages/Home.jsx
import React, { useState } from "react";
import Sidebar from "../components/Layout/Sidebar";
import HomeFeed from "../components/Feed/HomeFeed";
import Profile from "../components/Profile/Profile"; // ✅ corrected path
import AnonymousChat from "../components/Chat/AnonymousChat"; // ✅ floating chat
import defaultAvatar from "../assets/default-avatar.png"; // default user avatar
import "./Home.scss";

export default function Home() {
  const currentUser = {
    handle: "anon_user",
    avatar: defaultAvatar, // default avatar
  };

  // State for sidebar active item
  const [active, setActive] = useState("Home");

  // State for floating chat
  const [chatOpen, setChatOpen] = useState(false);

  // Render main content based on active nav
  const renderContent = () => {
    switch (active) {
      case "Home":
        return <HomeFeed currentUser={currentUser} />;
      case "Profile":
        return <Profile currentUser={currentUser} />; // display profile
      default:
        return (
          <div className="placeholder">
            <h2>{active}</h2>
            <p>This section is under construction.</p>
          </div>
        );
    }
  };

  return (
    <div className="home-page">
      {/* Sidebar with active state */}
      <Sidebar active={active} setActive={setActive} />

      {/* Main feed/content */}
      <main className="feed">{renderContent()}</main>

      {/* Floating Anonymous Chat (with its own FAB toggle) */}
      <AnonymousChat isOpen={chatOpen} toggleChat={() => setChatOpen(!chatOpen)} />
    </div>
  );
}
