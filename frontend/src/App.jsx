import { useEffect, useMemo, useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'

import { getMe } from './api/authApi'
import { clearAuthToken } from './api/axiosInstance'
import ToastContainer from './components/ToastContainer'
import AppRoutes from './routes/AppRoutes'

const App = () => {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [authReady, setAuthReady] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [toasts, setToasts] = useState([])

  useEffect(() => {
    const token = localStorage.getItem('ticketflow_token')

    if (!token) {
      setAuthReady(true)
      return
    }

    getMe()
      .then((currentUser) => {
        setUser(currentUser)
      })
      .catch(() => {
        clearAuthToken()
        setUser(null)
      })
      .finally(() => {
        setAuthReady(true)
      })
  }, [])

  const showToast = (message, type = 'success') => {
    const id = `toast-${Date.now()}-${Math.random().toString(16).slice(2)}`
    setToasts((current) => [...current, { id, message, type }])

    setTimeout(() => {
      setToasts((current) => current.filter((toast) => toast.id !== id))
    }, 3600)
  }

  const navigationItems = useMemo(
    () => [
      { to: '/dashboard', label: 'Dashboard' },
      { to: '/tickets', label: 'Tickets' },
      { to: '/tickets/create', label: 'New Ticket' },
      { to: '/profile', label: 'Profile' },
    ],
    [],
  )

  const handleLogout = () => {
    clearAuthToken()
    setUser(null)
    setSidebarOpen(false)
    showToast('You have been logged out.', 'info')
    navigate('/login', { replace: true })
  }

  const dismissToast = (id) => {
    setToasts((current) => current.filter((toast) => toast.id !== id))
  }

  if (!authReady) {
    return (
      <div className="app-shell app-shell-loading">
        <div className="loading-page">
          <div className="spinner" aria-hidden="true" />
          <span>Checking session...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="app-shell">
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />

      {user ? (
        <>
          <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
            <div className="brand-block">
              <Link to="/dashboard" className="brand" onClick={() => setSidebarOpen(false)}>
                TicketFlow
              </Link>
            </div>

            <nav className="sidebar-nav">
              {navigationItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                  onClick={() => setSidebarOpen(false)}
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>

            <div className="sidebar-footer">
              <div className="user-chip">
                <div className="avatar-mini">{user.name?.charAt(0)?.toUpperCase() || 'U'}</div>
                <div>
                  <strong>{user.name}</strong>
                  <span>{user.email}</span>
                </div>
              </div>
              <button type="button" className="logout-button" onClick={handleLogout}>
                Logout
              </button>
            </div>
          </aside>

          <div className="content-shell">
            <header className="topbar">
              <button type="button" className="menu-toggle" onClick={() => setSidebarOpen((current) => !current)}>
                ☰
              </button>
              <div className="topbar-actions">
                <Link to="/dashboard" className="topbar-button">
                  Dashboard
                </Link>
                <Link to="/tickets" className="topbar-button muted">
                  Tickets
                </Link>
              </div>
            </header>

            <main className="main-content">
              <AppRoutes user={user} setUser={setUser} showToast={showToast} />
            </main>
          </div>
        </>
      ) : (
        <main className="auth-shell">
          <AppRoutes user={user} setUser={setUser} showToast={showToast} />
        </main>
      )}
    </div>
  )
}

export default App
