// src/pages/Home.jsx
import React from "react";
import Sidebar from "../components/Layout/Sidebar";
import HomeFeed from "../components/Feed/HomeFeed";
import "./Home.scss";

export default function Home() {
  const currentUser = {
    handle: "anon_user",
    avatar: "../src/assets/default-avatar.png", // default profile image
  };

  return (
    <div className="home-page">
      {/* Sidebar */}
      <Sidebar />

      {/* Feed */}
      <main className="feed">
        <HomeFeed currentUser={currentUser} />
      </main>
    </div>
  );
}
