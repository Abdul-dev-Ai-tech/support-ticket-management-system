import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { getMe } from './api/authApi'
import { clearAuthToken } from './api/axiosInstance'
import ToastContainer from './components/ToastContainer'
import AppRoutes from './routes/AppRoutes'

const App = () => {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [authReady, setAuthReady] = useState(false)
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

  const handleLogout = () => {
    clearAuthToken()
    setUser(null)
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
      <main className="app-main-shell">
        <AppRoutes user={user} setUser={setUser} showToast={showToast} />
      </main>
    </div>
  )
}

export default App
