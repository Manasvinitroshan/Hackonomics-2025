// src/components/Sidebar.tsx
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  FaRocket,
  FaTachometerAlt,
  FaBook,
  FaCogs,
  FaComments,
  FaCalendarAlt,
  FaWallet
} from 'react-icons/fa';
import '../styles/sidebar.css';

const navItems = [
  { name: 'Dashboard',  icon: <FaTachometerAlt />, path: '/' },
  { name: 'Learn',      icon: <FaBook />,           path: '/learn' },
  { name: 'Simulation', icon: <FaCogs />,           path: '/simulation' },
  { name: 'Forum',      icon: <FaComments />,       path: '/forum' },
  { name: 'Events',     icon: <FaCalendarAlt />,    path: '/events' },
  { name: 'AI CFO',     icon: <FaWallet />,         path: '/ai-cfo' },
];

export default function Sidebar(): JSX.Element {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return (
    <aside className="sidebar-container">
      <div className="sidebar-header">
        <FaRocket className="sidebar-logo-icon" />
        <span className="sidebar-logo-text">Foundr</span>
      </div>

      <nav className="sidebar-nav">
        {navItems.map(item => {
          const isActive = item.path === '/'
            ? pathname === '/'
            : pathname.startsWith(item.path);

          return (
            <button
              key={item.name}
              className={`sidebar-link ${isActive ? 'active' : ''}`}
              onClick={() => navigate(item.path)}
            >
              <span className="sidebar-icon">{item.icon}</span>
              <span className="sidebar-link-text">{item.name}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
