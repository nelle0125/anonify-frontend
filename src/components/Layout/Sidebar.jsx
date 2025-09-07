// src/components/Layout/Sidebar.jsx
import React, { useState, useEffect } from "react";
import {
  FiHome,
  FiSearch,
  FiCompass,
  FiMessageCircle,
  FiBell,
  FiPlusSquare,
  FiUser,
} from "react-icons/fi";
import logo from "../../assets/logo.png"; // small logo icon
import "./Sidebar.scss";

export default function Sidebar({ active, setActive }) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Auto-collapse on smaller screens
  useEffect(() => {
    const handleResize = () => setIsCollapsed(window.innerWidth <= 900);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Sidebar navigation items
  const navItems = [
    { name: "Home", icon: <FiHome /> },
    { name: "Search", icon: <FiSearch /> },
    { name: "Explore", icon: <FiCompass /> },
    { name: "Messages", icon: <FiMessageCircle /> },
    { name: "Notifications", icon: <FiBell /> },
    { name: "Create", icon: <FiPlusSquare /> },
  ];

  return (
    <aside className={`sidebar ${isCollapsed ? "collapsed" : ""}`}>
      {/* Logo Section */}
      <div className="sidebar-logo">
        {isCollapsed ? (
          <img src={logo} alt="Anonify" className="logo-icon" />
        ) : (
          <h1 className="app-name">ANNFY</h1>
        )}
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <button
            key={item.name}
            className={`nav-item ${active === item.name ? "active" : ""}`}
            onClick={() => setActive(item.name)}
          >
            {item.icon}
            {!isCollapsed && <span>{item.name}</span>}
            {active === item.name && !isCollapsed && (
              <div className="active-indicator" />
            )}
          </button>
        ))}

        {/* Profile always at bottom */}
        <div className="sidebar-profile">
          <button
            className={`nav-item profile-link ${active === "Profile" ? "active" : ""}`}
            onClick={() => setActive("Profile")}
          >
            <FiUser />
            {!isCollapsed && <span>Profile</span>}
            {active === "Profile" && !isCollapsed && (
              <div className="active-indicator" />
            )}
          </button>
        </div>
      </nav>
    </aside>
  );
}
