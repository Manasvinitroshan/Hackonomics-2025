import React from 'react';
import '/Users/manassingh/LeanFoundr/frontend/src/styles/login.css';

export default function Footer() {
  return (
    <footer className="footer">
      <p>© {new Date().getFullYear()} FinLaunch · <a href="/privacy">Privacy</a> · <a href="/terms">Terms</a></p>
    </footer>
  );
}
