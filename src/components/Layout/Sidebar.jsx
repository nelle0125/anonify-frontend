
import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import {
  FiHome,
  FiSearch,
  FiCompass,
  FiMessageCircle,
  FiBell,
  FiPlusSquare,
  FiUser,
  FiLogOut,
} from "react-icons/fi";
import logo from "../../assets/logo.png";
import defaultAvatar from "../../assets/default-avatar.png";
import "./Sidebar.scss";

export default function Sidebar({ active, setActive }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const profileRef = useRef(null);

  useEffect(() => {
    setMounted(true); 
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

  
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navItems = [
    { name: "Home", icon: <FiHome /> },
    { name: "Search", icon: <FiSearch /> },
    { name: "Notifications", icon: <FiBell /> },
    { name: "Profile", icon: <FiUser /> },
  ];

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    window.location.href = "/login";
  };

  
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

      
      <div className="sidebar-footer" ref={profileRef}>
        <button
          className="profile-btn"
          type="button"
          onClick={() => setProfileMenuOpen((p) => !p)}
        >
          <img src={defaultAvatar} alt="Profile" className="avatar" />
          {!isCollapsed && <span>anon_user</span>}
        </button>

        {profileMenuOpen && (
          <div className="profile-menu">
            <button className="logout-btn" onClick={handleLogout}>
              <FiLogOut /> Logout
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
