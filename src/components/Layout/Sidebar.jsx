// src/components/Layout/Sidebar.jsx
import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  FiHome,
  FiSearch,
  FiCompass,
  FiMessageCircle,
  FiBell,
  FiPlusSquare,
  FiUser,
  FiLogOut, // ✅ logout icon
} from "react-icons/fi";
import logo from "../../assets/logo.png";
import "./Sidebar.scss";

export default function Sidebar({ active, setActive }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true); // only after client-side render
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsCollapsed(window.innerWidth <= 900);
      setIsMobile(window.innerWidth <= 600);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const navItems = [
    { name: "Home", icon: <FiHome /> },
    { name: "Search", icon: <FiSearch /> },
    { name: "Notifications", icon: <FiBell /> },
    { name: "Profile", icon: <FiUser /> },
  ];

  // --- 🚪 Logout functionality ---
  const handleLogout = () => {
    // Clear session/auth data
    localStorage.clear();
    sessionStorage.clear();

    // Redirect to login page (or home)
    window.location.href = "/login";
  };

  // --- 📱 Mobile bottom nav ---
  if (isMobile && mounted) {
    return createPortal(
      <nav className="mobile-bottom-nav" role="navigation">
        {navItems.map((item) => (
          <button
            key={item.name}
            className={`nav-item ${active === item.name ? "active" : ""}`}
            onClick={() => setActive(item.name)}
            type="button"
            aria-label={item.name}
          >
            {item.icon}
          </button>
        ))}
        {/* ✅ Logout button in mobile nav */}
        <button
          className="nav-item logout"
          onClick={handleLogout}
          type="button"
          aria-label="Logout"
        >
          <FiLogOut />
        </button>
      </nav>,
      document.body
    );
  }

  // --- 💻 Desktop / Tablet sidebar ---
  return (
    <aside className={`sidebar ${isCollapsed ? "collapsed" : ""}`}>
      <div className="sidebar-logo">
        {isCollapsed ? (
          <img src={logo} alt="Anonify" className="logo-icon" />
        ) : (
          <h1 className="app-name">ANNFY</h1>
        )}
      </div>

      <nav className="sidebar-nav" aria-label="Main Navigation">
        {navItems.map((item) => (
          <button
            key={item.name}
            className={`nav-item ${active === item.name ? "active" : ""}`}
            onClick={() => setActive(item.name)}
            type="button"
          >
            {item.icon}
            {!isCollapsed && <span>{item.name}</span>}
            {active === item.name && !isCollapsed && (
              <div className="active-indicator" />
            )}
          </button>
        ))}
      </nav>

      {/* ✅ Logout button at bottom */}
      <div className="sidebar-footer">
        <button className="nav-item logout" onClick={handleLogout} type="button">
          <FiLogOut />
          {!isCollapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
}
