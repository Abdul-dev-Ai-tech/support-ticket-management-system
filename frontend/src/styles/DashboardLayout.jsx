import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

import "../styles/layout.css";
import "../styles/components.css";
import "../styles/animations.css";

function DashboardLayout({ user, onLogout }) {
  return (
    <div className="dashboard-app">

      {/* Animated Background */}
      <div className="bg-glow bg-glow-purple"></div>
      <div className="bg-glow bg-glow-blue"></div>
      <div className="bg-glow bg-glow-pink"></div>

      {/* Common Navbar */}
      <Navbar
        user={user}
        onLogout={onLogout}
      />

      {/* Current page yahan render hogi */}
      <main className="dashboard-page-content fade-up">
        <Outlet />
      </main>

    </div>
  );
}

export default DashboardLayout;