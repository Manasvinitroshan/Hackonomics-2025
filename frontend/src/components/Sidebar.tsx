import { FaTachometerAlt, FaBook, FaCogs, FaComments, FaCalendarAlt } from 'react-icons/fa';
import '../styles/sidebar.css'; // Your styles file

const navItems = [
  { name: 'Dashboard', icon: <FaTachometerAlt /> },
  { name: 'Learn', icon: <FaBook /> },
  { name: 'Simulation', icon: <FaCogs /> },
  { name: 'Forum', icon: <FaComments /> },
  { name: 'Events', icon: <FaCalendarAlt /> },
  { name: 'AI CFO', icon: <FaCalendarAlt /> },
];

export default function Sidebar({ onTabChange, activeTab }) {
  return (
    <div className="sidebar-container">
      <h1 className="sidebar-title">FinLaunch</h1>
      <nav className="sidebar-nav">
        {navItems.map(({ name, icon }) => (
          <button
            key={name}
            onClick={() => onTabChange(name)}
            className={`sidebar-link ${activeTab === name ? 'active' : ''}`}
          >
            <span className="sidebar-icon">{icon}</span>
            {name}
          </button>
        ))}
      </nav>
    </div>
  );
}
