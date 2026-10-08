import { Navigate, Route, Routes } from 'react-router-dom'

import ProtectedRoute from '../components/ProtectedRoute'
import Login from '../pages/Login'
import Register from '../pages/Register'
import Dashboard from '../pages/Dashboard'
import Profile from '../pages/Profile'
import Tickets from '../pages/Tickets'
import CreateTicket from '../pages/CreateTicket'
import TicketDetails from '../pages/TicketDetails'
import EditTicket from '../pages/EditTicket'

const AppRoutes = ({ user, setUser, showToast }) => {
  return (
    <Routes>
      <Route path="/" element={user ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />} />
      <Route path="/login" element={<Login setUser={setUser} showToast={showToast} />} />
      <Route path="/register" element={<Register showToast={showToast} />} />

      <Route element={<ProtectedRoute user={user} />}>
        <Route path="/dashboard" element={<Dashboard user={user} />} />
        <Route path="/profile" element={<Profile user={user} />} />
        <Route path="/tickets" element={<Tickets showToast={showToast} />} />
        <Route path="/tickets/create" element={<CreateTicket showToast={showToast} />} />
        <Route path="/tickets/:id" element={<TicketDetails showToast={showToast} />} />
        <Route path="/tickets/:id/edit" element={<EditTicket showToast={showToast} />} />
      </Route>
    </Routes>
  )
}

export default AppRoutes
