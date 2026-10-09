import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'

import { getMe } from '../api/authApi'
import { getTickets } from '../api/ticketApi'

function Dashboard() {
  const {
    data: user,
    isLoading: userLoading,
    isError: userError,
  } = useQuery({
    queryKey: ['current-user'],
    queryFn: () => getMe(),
  })

  const {
    data: ticketResponse,
    isLoading: ticketsLoading,
    isError: ticketsError,
  } = useQuery({
    queryKey: ['tickets', 'dashboard'],
    queryFn: () => getTickets({ page: 1, limit: 100 }),
  })

  const tickets = Array.isArray(ticketResponse)
    ? ticketResponse
    : ticketResponse?.items || []

  const total = tickets.length
  const open = tickets.filter((ticket) => ticket.status === 'open').length
  const inProgress = tickets.filter((ticket) => ticket.status === 'in_progress').length
  const resolved = tickets.filter((ticket) => ticket.status === 'resolved').length
  const closed = tickets.filter((ticket) => ticket.status === 'closed').length

  const recentTickets = [...tickets]
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 5)

  const displayName = user?.name?.split(' ')[0] || 'User'

  if (userLoading || ticketsLoading) {
    return (
      <div className="dashboard-loading glass-card">
        <div className="dashboard-loader"></div>
        <p>Loading your dashboard...</p>
      </div>
    )
  }

  if (userError || ticketsError) {
    return (
      <div className="dashboard-loading glass-card">
        <p>Unable to load dashboard data.</p>
      </div>
    )
  }

  return (
    <div className="dashboard-modern">
      <section className="dashboard-hero-modern">
        <div className="dashboard-hero-overlay"></div>

        <div className="dashboard-hero-content">
          <span className="dashboard-eyebrow">SUPPORT COMMAND CENTER</span>

          <h1>
            Welcome back,
            <br />
            <span>{displayName} 👋</span>
          </h1>

          <p>
            Manage, track and resolve your support requests from one powerful workspace.
          </p>

          <div className="dashboard-actions">
            <Link to="/tickets/create" className="btn-primary dashboard-action">
              + Create Ticket
            </Link>

            <Link to="/tickets/board" className="btn-secondary dashboard-action">
              View Workflow
            </Link>
          </div>
        </div>

        <div className="dashboard-hero-floating glass-card">
          <div className="hero-floating-icon">✦</div>

          <div>
            <strong>Faster Solutions</strong>
            <span>Happier Customers</span>
          </div>
        </div>
      </section>

      <section className="dashboard-stats">
        <StatCard icon="🎫" value={total} label="Total Tickets" accent="blue" />
        <StatCard icon="◉" value={open} label="Open" accent="pink" />
        <StatCard icon="⚡" value={inProgress} label="In Progress" accent="orange" />
        <StatCard icon="✓" value={resolved} label="Resolved" accent="green" />
        <StatCard icon="▣" value={closed} label="Closed" accent="gray" />
      </section>

      <section className="dashboard-bottom-grid">
        <div className="dashboard-panel glass-card">
          <div className="dashboard-panel-header">
            <div>
              <span className="dashboard-eyebrow">LATEST ACTIVITY</span>
              <h2>Recent Tickets</h2>
            </div>

            <Link to="/tickets" className="dashboard-view-all">
              View all
            </Link>
          </div>

          {recentTickets.length === 0 ? (
            <div className="dashboard-empty">No tickets found.</div>
          ) : (
            <div className="recent-ticket-list">
              {recentTickets.map((ticket) => (
                <Link to={`/tickets/${ticket.id}`} key={ticket.id} className="recent-ticket-row">
                  <div className="recent-ticket-main">
                    <span className="recent-ticket-id">#TKT-{ticket.id}</span>
                    <strong>{ticket.title}</strong>
                  </div>

                  <span className={`dashboard-badge status-${ticket.status}`}>
                    {formatStatus(ticket.status)}
                  </span>

                  <span className={`dashboard-badge priority-${ticket.priority}`}>
                    {ticket.priority}
                  </span>

                  <span className="ticket-date">{formatDate(ticket.created_at)}</span>
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className="dashboard-panel glass-card">
          <div className="dashboard-panel-header">
            <div>
              <span className="dashboard-eyebrow">SHORTCUTS</span>
              <h2>Quick Actions</h2>
            </div>
          </div>

          <div className="quick-actions-grid">
            <QuickAction to="/tickets/create" icon="+" title="New Ticket" text="Create a support request" />
            <QuickAction to="/tickets/board" icon="◫" title="Workflow" text="Manage ticket statuses" />
            <QuickAction to="/tickets" icon="▣" title="All Tickets" text="Browse your support tickets" />
            <QuickAction to="/profile" icon="○" title="Profile" text="Manage your account" />
          </div>
        </div>
      </section>
    </div>
  )
}

function StatCard({ icon, value, label, accent }) {
  return (
    <article className={`dashboard-stat-card glass-card stat-${accent}`}>
      <div className="dashboard-stat-top">
        <div className="dashboard-stat-icon">{icon}</div>
        <span className="stat-dot"></span>
      </div>

      <strong className="dashboard-stat-number">{value}</strong>
      <span className="dashboard-stat-label">{label}</span>
    </article>
  )
}

function QuickAction({ to, icon, title, text }) {
  return (
    <Link to={to} className="quick-action">
      <div className="quick-action-icon">{icon}</div>

      <div>
        <strong>{title}</strong>
        <span>{text}</span>
      </div>
    </Link>
  )
}

function formatStatus(status) {
  if (status === 'in_progress') {
    return 'In Progress'
  }

  if (!status) {
    return ''
  }

  return status.charAt(0).toUpperCase() + status.slice(1)
}

function formatDate(date) {
  if (!date) {
    return ''
  }

  return new Date(date).toLocaleDateString()
}

export default Dashboard
