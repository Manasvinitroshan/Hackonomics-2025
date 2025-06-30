// src/App.tsx
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from './router/AppRoutes';

export default function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}
