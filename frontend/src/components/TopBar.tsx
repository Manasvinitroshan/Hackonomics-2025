import { useEffect, useState } from 'react';
import '/Users/manassingh/LeanFoundr/frontend/src/styles/topbar.css'
import '/Users/manassingh/LeanFoundr/frontend/src/App.css'

const Topbar = () => {
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  return (
    <div className="topbar">
      <div className="topbar-left">🚀 FinLaunch</div>
      <div className="topbar-right">
        <button onClick={() => setDarkMode(prev => !prev)}>
          {darkMode ? '☀️ Light' : '🌙 Dark'}
        </button>
        <div className="user-avatar">👤</div>
      </div>
    </div>
  );
};

export default Topbar;
