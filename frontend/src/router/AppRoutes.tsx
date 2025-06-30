// src/router/AppRoutes.tsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Layout           from '../components/Layout';
import Dashboard        from '../pages/Dashboard';
import Learn            from '../pages/Learn';
import Module           from '../pages/Module';
import Simulation       from '../pages/Simulation';
import SimulationDetail from '../pages/simulations/SimulationDetails';
import Forum            from '../pages/Forum';
import Events           from '../pages/Events';
import AiCFO            from '../pages/AiCFO';
import NotFound         from '../pages/NotFound';

import Login            from '../pages/Login';
import Signup           from '../pages/Signup';
import ConfirmSignup    from '../pages/ConfirmSignUp';

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public/auth pages */}
      <Route path="/login"  element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/confirm" element={<ConfirmSignup />} />

      {/* All “app” routes share the same sidebar + footer */}
      <Route element={<Layout />}>
        <Route index                  element={<Dashboard />} />
        <Route path="dashboard"       element={<Dashboard />} />
        <Route path="learn"           element={<Learn />} />
        <Route path="learn/module/:id" element={<Module />} />
        <Route path="simulation"      element={<Simulation />} />
        <Route path="simulation/:title" element={<SimulationDetail />} />
        <Route path="forum"           element={<Forum />} />
        <Route path="events"          element={<Events />} />
        <Route path="ai-cfo"          element={<AiCFO />} />
      </Route>

      {/* Catch‐all 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
