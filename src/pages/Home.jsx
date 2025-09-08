
import React, { useState } from "react";
import Sidebar from "../components/Layout/Sidebar";
import HomeFeed from "../components/Feed/HomeFeed";
import Profile from "../components/Profile/Profile"; 
import AnonymousChat from "../components/Chat/AnonymousChat"; 
import defaultAvatar from "../assets/default-avatar.png"; 
import "./Home.scss";

export default function Home() {
  const currentUser = {
    handle: "anon_user",
    avatar: defaultAvatar, 
  };

  
  const [active, setActive] = useState("Home");

  
  const [chatOpen, setChatOpen] = useState(false);

  
  const renderContent = () => {
    switch (active) {
      case "Home":
        return <HomeFeed currentUser={currentUser} />;
      case "Profile":
        return <Profile currentUser={currentUser} />; 
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
      
      <Sidebar active={active} setActive={setActive} />

      
      <main className="feed">{renderContent()}</main>

      
      <AnonymousChat isOpen={chatOpen} toggleChat={() => setChatOpen(!chatOpen)} />
    </div>
  );
}
