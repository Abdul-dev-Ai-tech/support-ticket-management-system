import { Outlet, useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import { getMe } from "../api/authApi";
import Navbar from "./Navbar";

import "../styles/layout.css";
import "../styles/components.css";
import "../styles/animations.css";

const TOKEN_KEY = "ticketflow_token";

function DashboardLayout() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: user } = useQuery({
    queryKey: ["current-user"],
    queryFn: getMe,
    staleTime: 60 * 1000,
  });

  const handleLogout = () => {
    localStorage.removeItem(TOKEN_KEY);
    queryClient.clear();
    navigate("/login", { replace: true });
  };

  return (
    <div className="dashboard-app">
      <div className="bg-glow bg-glow-purple"></div>
      <div className="bg-glow bg-glow-blue"></div>
      <div className="bg-glow bg-glow-pink"></div>

      <Navbar user={user} onLogout={handleLogout} />

      <main className="dashboard-page-content fade-up">
        <Outlet />
      </main>

      <footer className="dashboard-footer">
        <div className="dashboard-footer-inner">
          <div className="footer-brand">
            <div className="footer-logo">T</div>

            <div className="footer-brand-copy">
              <strong>TicketFlow</strong>
              <span>Created by Abdul Rehman</span>
            </div>
          </div>

          <div className="footer-contact">
            <a href="tel:+923001234567">+92 300 1234567</a>
            <a href="mailto:tiku.mitku@gmail.com">tiku.mitku@gmail.com</a>
          </div>

          <div className="footer-socials">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              className="social-link insta"
              aria-label="Instagram"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <rect x="3.5" y="3.5" width="17" height="17" rx="5" fill="none" stroke="currentColor" strokeWidth="1.8" />
                <circle cx="12" cy="12" r="4.2" fill="none" stroke="currentColor" strokeWidth="1.8" />
                <circle cx="17.2" cy="6.8" r="1.2" fill="currentColor" />
              </svg>
            </a>
            <a
              href="https://wa.me/923001234567"
              target="_blank"
              rel="noreferrer"
              className="social-link whatsapp"
              aria-label="WhatsApp"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path
                  fill="currentColor"
                  d="M12.04 2C6.58 2 2.13 6.25 2.13 11.52c0 1.86.53 3.68 1.52 5.22L2 22l5.52-1.5c1.5.82 3.18 1.25 4.97 1.25 5.46 0 9.91-4.25 9.91-9.52S17.5 2 12.04 2zm5.37 13.28c-.23.66-1.33 1.2-1.9 1.27-.48.06-.96.09-3.05-.64-2.58-1.1-4.2-3.6-4.33-3.75-.13-.15-1.1-1.32-1.1-2.55 0-1.22.63-1.8.85-2.05.22-.24.47-.31.7-.31h.5c.16 0 .39.01.6.46.24.52.8 1.8.87 1.93.07.14.13.33-.03.53-.17.2-.3.37-.45.56-.15.19-.31.42-.13.7.18.28.8 1.17 1.57 1.82.93.83 1.76 1.1 2.12 1.22.35.11.57.1.78-.09.19-.17.77-.9.98-1.23.2-.32.38-.27.65-.15.27.11 1.72.82 2.02 1 .3.18.5.2.74.13.25-.07 1.48-.86 1.7-1.19.22-.33.4-.27.65-.15.25.12 1.66.79 1.95.93.29.13.5.2.57.31.07.13.07.74-.15 1.41z"
                />
              </svg>
            </a>
            <a href="mailto:tiku.mitku@gmail.com" className="social-link email" aria-label="Email">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path
                  fill="currentColor"
                  d="M3 6.75A2.75 2.75 0 0 1 5.75 4h12.5A2.75 2.75 0 0 1 21 6.75v10.5A2.75 2.75 0 0 1 18.25 20H5.75A2.75 2.75 0 0 1 3 17.25V6.75zm2.2-.75 6.8 5.12 6.8-5.12H5.2zm13.55 2.4-6.29 4.74a1 1 0 0 1-1.12 0L5.25 8.4v8.85c0 .41.34.75.75.75h12c.41 0 .75-.34.75-.75V8.4z"
                />
              </svg>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default DashboardLayout;
