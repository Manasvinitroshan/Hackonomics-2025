// src/router/AppRoutes.tsx
import { Routes, Route } from "react-router-dom";

import Login      from "../pages/Login";
import Signup     from "../pages/Signup";
import Home       from "../pages/Home";
import Dashboard  from "../pages/Dashboard";
import Learn      from "../pages/Learn";
import Simulation from "../pages/Simulation";
import Forum      from "../pages/Forum";
import Events     from "../pages/Events";
import NotFound   from "../pages/NotFound";
import ConfirmSignup from "../pages/ConfirmSignUp";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/"           element={<Home />} />
      <Route path="/dashboard"  element={<Dashboard />} />
      <Route path="/learn"      element={<Learn />} />
      <Route path="/simulation" element={<Simulation />} />
      <Route path="/forum"      element={<Forum />} />
      <Route path="/events"     element={<Events />} />
      <Route path="/login"      element={<Login />} />
      <Route path="/signup"     element={<Signup />} />
      <Route path="/confirm" element={<ConfirmSignup />} />
      <Route path="*"           element={<NotFound />} />
    </Routes>
  );
}
 