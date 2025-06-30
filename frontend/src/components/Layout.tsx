// src/components/Layout.tsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Footer  from './Footer';
import '/Users/manassingh/LeanFoundr/frontend/src/App.css';
import '../styles/sidebar.css';

export default function Layout() {
  return (
    <div className="app-shell">
      <Sidebar />
      <div className="main-content">
        <main className="content-area">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
}
