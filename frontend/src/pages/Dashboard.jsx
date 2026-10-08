import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'

import { getTickets } from '../api/ticketApi'
import LoadingSpinner from '../components/LoadingSpinner'
import ErrorState from '../components/ErrorState'

const formatDate = (dateString) => {
  if (!dateString) {
    return '—'
  }

  return new Date(dateString).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

const Dashboard = ({ user }) => {
  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['dashboard-tickets'],
    queryFn: () => getTickets({ page: 1, limit: 100 }),
  })

  const tickets = data?.items ?? []
  const totalTickets = tickets.length
  const openCount = tickets.filter((ticket) => ticket.status === 'open').length
  const inProgressCount = tickets.filter((ticket) => ticket.status === 'in_progress').length
  const resolvedCount = tickets.filter((ticket) => ticket.status === 'resolved').length
  const closedCount = tickets.filter((ticket) => ticket.status === 'closed').length
  const recentTickets = tickets.slice(0, 5)

  if (isLoading) {
    return <LoadingSpinner message="Loading dashboard..." />
  }

  if (isError) {
    return <ErrorState title="Unable to load dashboard" message={error?.message || 'Please try again.'} onRetry={refetch} />
  }

  return (
    <div className="dashboard-page">
      <div className="page-header dashboard-header">
        <div>
          <p className="eyebrow">Overview</p>
          <h1>Welcome back, {user?.name || 'Support team'}</h1>
          <p className="subtle-text">Here is an overview of your support tickets.</p>
        </div>
      </div>

      <div className="summary-grid">
        <div className="summary-card summary-card-purple">
          <div className="summary-icon">▣</div>
          <div>
            <span>Total Tickets</span>
            <strong>{totalTickets}</strong>
          </div>
        </div>

        <div className="summary-card summary-card-blue">
          <div className="summary-icon">◔</div>
          <div>
            <span>Open</span>
            <strong>{openCount}</strong>
          </div>
        </div>

        <div className="summary-card summary-card-amber">
          <div className="summary-icon">◷</div>
          <div>
            <span>In Progress</span>
            <strong>{inProgressCount}</strong>
          </div>
        </div>

        <div className="summary-card summary-card-green">
          <div className="summary-icon">✓</div>
          <div>
            <span>Resolved</span>
            <strong>{resolvedCount}</strong>
          </div>
        </div>

        <div className="summary-card summary-card-slate">
          <div className="summary-icon">○</div>
          <div>
            <span>Closed</span>
            <strong>{closedCount}</strong>
          </div>
        </div>
      </div>

      <div className="panel-card">
        <div className="section-heading">
          <h2>Recent Tickets</h2>
          <Link to="/tickets" className="text-link">
            View all
          </Link>
        </div>

        {recentTickets.length ? (
          <div className="recent-ticket-list">
            {recentTickets.map((ticket) => (
              <div key={ticket.id} className="recent-ticket-row">
                <div className="recent-meta">
                  <span className="ticket-id-mini">#{ticket.id}</span>
                  <h3>{ticket.title}</h3>
                </div>

                <div className="ticket-quick-meta">
                  <span className={`badge badge-priority badge-${ticket.priority}`}>{ticket.priority}</span>
                  <span className="pill pill-soft">{ticket.category}</span>
                  <span className={`badge badge-status badge-${ticket.status}`}>{ticket.status.replace('_', ' ')}</span>
                  <span className="date-text">{formatDate(ticket.created_at)}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-mini">No recent tickets yet.</div>
        )}
      </div>
    </div>
  )
}

export default Dashboard
