// src/components/Sidebar.jsx
import React from 'react';
import {
  FaTachometerAlt,
  FaBook,
  FaCogs,
  FaComments,
  FaCalendarAlt,
  FaWallet
} from 'react-icons/fa';
import '../styles/sidebar.css';

const navItems = [
  { name: 'Dashboard',  icon: <FaTachometerAlt /> },
  { name: 'Learn',      icon: <FaBook /> },
  { name: 'Simulation', icon: <FaCogs /> },
  { name: 'Forum',      icon: <FaComments /> },
  { name: 'Events',     icon: <FaCalendarAlt /> },
  { name: 'AI CFO',     icon: <FaWallet /> },  // switched to a wallet icon
];

export default function Sidebar({ onTabChange, activeTab }) {
  return (
    <aside className="sidebar-container">
      {/* ─── “🚀 Foundr” HEADER ─────────────────────────────── */}
      <div className="sidebar-header">
        <span className="sidebar-logo-emoji">🚀</span>
        <span className="sidebar-logo-text">Foundr</span>
      </div>

      {/* ─── FLAT LIST OF NAV ITEMS ────────────────────────── */}
      <nav className="sidebar-nav">
        {navItems.map(({ name, icon }) => (
          <button
            key={name}
            onClick={() => onTabChange(name)}
            className={`sidebar-link ${activeTab === name ? 'active' : ''}`}
          >
            <span className="sidebar-icon">{icon}</span>
            <span className="sidebar-link-text">{name}</span>
          </button>
        ))}
      </nav>
    </aside>
  );
}
