import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

function Navbar({ user, onLogout }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    }

    setMenuOpen(false);
    navigate("/login");
  };

  return (
    <header className="modern-navbar glass-card">
      <NavLink to={user ? "/dashboard" : "/login"} className="nav-brand">
        <div className="nav-logo">T</div>

        <div className="nav-brand-text">
          <strong>TicketFlow</strong>
          <span>Support Center</span>
        </div>
      </NavLink>

      <button
        type="button"
        className="nav-menu-button"
        onClick={() => setMenuOpen((open) => !open)}
      >
        ☰
      </button>

      <nav className={`nav-links ${menuOpen ? "show" : ""}`}>
        {user && (
          <>
            <NavLink
              to="/dashboard"
              className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
            >
              Dashboard
            </NavLink>

            <NavLink
              to="/tickets"
              className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
            >
              Tickets
            </NavLink>

            <NavLink
              to="/tickets/board"
              className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
            >
              Workflow
            </NavLink>

            <NavLink
              to="/tickets/create"
              className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
            >
              Create Ticket
            </NavLink>
          </>
        )}
      </nav>

      <div className={`nav-account ${menuOpen ? "show" : ""}`}>
        {user ? (
          <>
            <div className="nav-user">
              <div className="nav-avatar">
                {user?.name?.charAt(0)?.toUpperCase() || "U"}
              </div>

              <div className="nav-user-info">
                <strong>{user?.name || "User"}</strong>
                <span>{user?.email}</span>
              </div>
            </div>

            <button type="button" className="nav-logout" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <NavLink to="/login" className="nav-login">
              Login
            </NavLink>

            <NavLink to="/register" className="nav-register">
              Sign Up
            </NavLink>
          </>
        )}
      </div>
    </header>
  );
}

export default Navbar;
