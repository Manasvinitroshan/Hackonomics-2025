import { Link, useLocation } from 'react-router-dom';
import '/Users/manassingh/LeanFoundr/frontend/src/styles/sidebar.css'; // Optional: for custom styles

const navItems = [
  { name: 'Dashboard', path: '/dashboard' },
  { name: 'Learn', path: '/learn' },
  { name: 'Simulation', path: '/simulation' },
  { name: 'Forum', path: '/forum' },
  { name: 'Events', path: '/events' },
];

export default function Sidebar({ onTabChange, activeTab }) {
  const navItems = ['Dashboard', 'Learn', 'Simulation', 'Forum', 'Events'];

  return (
    <div className="sidebar bg-indigo-700 text-white min-h-screen w-64 px-4 py-8">
      <h1 className="text-xl font-bold mb-8">FinLaunch</h1>
      <nav className="flex flex-col space-y-4">
        {navItems.map((name) => (
          <button
            key={name}
            onClick={() => onTabChange(name)}
            className={`text-left px-4 py-2 rounded transition ${
              activeTab === name ? 'bg-indigo-600' : 'hover:bg-indigo-600'
            }`}
            style={{
              backgroundColor: activeTab === name ? '#4f46e5' : 'transparent',
              border: 'none',
              color: 'white',
              cursor: 'pointer',
            }}
          >
            {name}
          </button>
        ))}
      </nav>
    </div>
  );
}
