import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { deleteTicket, getTickets } from '../api/ticketApi'
import AlertBanner from '../components/AlertBanner'
import ConfirmModal from '../components/ConfirmModal'
import Loading from '../components/Loading'

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

const Tickets = ({ showToast }) => {
  const location = useLocation()
  const queryClient = useQueryClient()
  const successMessage = location.state?.successMessage

  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [status, setStatus] = useState('all')
  const [priority, setPriority] = useState('all')
  const [category, setCategory] = useState('all')
  const [searchInput, setSearchInput] = useState('')
  const [search, setSearch] = useState('')
  const [deleteTarget, setDeleteTarget] = useState(null)

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput.trim())
    }, 400)

    return () => clearTimeout(timer)
  }, [searchInput])

  useEffect(() => {
    setPage(1)
  }, [status, priority, category, search])

  const queryParams = {
    page,
    limit,
    status: status === 'all' ? undefined : status,
    priority: priority === 'all' ? undefined : priority,
    category: category === 'all' ? undefined : category,
    search: search || undefined,
  }

  const {
    data,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['tickets', queryParams],
    queryFn: () => getTickets(queryParams),
    keepPreviousData: true,
  })

  const tickets = data?.items ?? []
  const totalRecords = data?.total ?? 0
  const totalPages = data?.total_pages ?? 1
  const currentPage = data?.page ?? page

  const deleteMutation = useMutation({
    mutationFn: deleteTicket,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tickets'] })
      setDeleteTarget(null)
      showToast?.('Ticket deleted successfully', 'success')
    },
    onError: (error) => {
      showToast?.(error?.response?.data?.detail || error?.message || 'Unable to delete ticket.', 'error')
    },
  })

  const handleDelete = (id) => {
    deleteMutation.mutate(id)
  }

  const handlePageChange = (nextPage) => {
    setPage(Math.max(1, nextPage))
  }

  const clearFilters = () => {
    setStatus('all')
    setPriority('all')
    setCategory('all')
    setSearchInput('')
    setSearch('')
  }

  if (isLoading && !data) {
    return <Loading message="Loading tickets..." />
  }

  if (isError) {
    return (
      <div className="message-box error">
        <h2>Something went wrong</h2>
        <p>{error.message}</p>
      </div>
    )
  }

  return (
    <div className="page-shell">
      <div className="page-header">
        <div>
          <span className="page-eyebrow">Support center</span>
          <h1 className="page-title">Tickets</h1>
          <p className="page-description">Monitor and manage all support requests in one place.</p>
        </div>

        <div className="action-row">
          <Link to="/tickets/create" className="page-button page-button-primary">
            + Create ticket
          </Link>
        </div>
      </div>

      <AlertBanner type="success" message={successMessage} />

      <section className="filter-panel">
        <div className="filter-grid">
          <div className="filter-group">
            <label htmlFor="ticket-search">Search</label>
            <input
              id="ticket-search"
              type="text"
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
              placeholder="Search title or description"
            />
          </div>

          <div className="filter-group">
            <label htmlFor="status-filter">Status</label>
            <select id="status-filter" value={status} onChange={(event) => setStatus(event.target.value)}>
              <option value="all">All Statuses</option>
              <option value="open">Open</option>
              <option value="in_progress">In Progress</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="priority-filter">Priority</label>
            <select id="priority-filter" value={priority} onChange={(event) => setPriority(event.target.value)}>
              <option value="all">All Priorities</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="category-filter">Category</label>
            <select id="category-filter" value={category} onChange={(event) => setCategory(event.target.value)}>
              <option value="all">All Categories</option>
              <option value="technical">Technical</option>
              <option value="billing">Billing</option>
              <option value="account">Account</option>
              <option value="general">General</option>
            </select>
          </div>
        </div>

        <div className="filter-actions">
          <button type="button" className="page-button page-button-secondary" onClick={clearFilters}>
            Clear filters
          </button>
        </div>
      </section>

      <div className="stats-grid">
        <div className="stat-card">
          <span className="stat-label">Total</span>
          <strong>{totalRecords}</strong>
        </div>
        <div className="stat-card">
          <span className="stat-label">Open</span>
          <strong>{tickets.filter((ticket) => ticket.status === 'open').length}</strong>
        </div>
        <div className="stat-card">
          <span className="stat-label">High Priority</span>
          <strong>{tickets.filter((ticket) => ticket.priority === 'high').length}</strong>
        </div>
        <div className="stat-card">
          <span className="stat-label">Resolved</span>
          <strong>{tickets.filter((ticket) => ticket.status === 'resolved').length}</strong>
        </div>
      </div>

      <div className="pagination-bar">
        <div className="pagination-controls">
          <button
            type="button"
            className="page-button page-button-secondary"
            disabled={currentPage === 1 || isLoading}
            onClick={() => handlePageChange(currentPage - 1)}
          >
            Previous
          </button>

          <span className="pagination-status">Page {currentPage} / {Math.max(totalPages, 1)}</span>

          <button
            type="button"
            className="page-button page-button-secondary"
            disabled={currentPage >= totalPages || totalPages === 0 || isLoading}
            onClick={() => handlePageChange(currentPage + 1)}
          >
            Next
          </button>
        </div>

        <div className="pagination-summary">
          <span>Total records: {totalRecords}</span>
          <label>
            Page size
            <select
              value={limit}
              onChange={(event) => {
                setLimit(Number(event.target.value))
                setPage(1)
              }}
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </label>
        </div>
      </div>

      {!tickets.length ? (
        <div className="empty-state-panel">
          <div className="empty-state-icon">•</div>
          <h2>No tickets found</h2>
          <p>Try changing your filters or create a new support ticket.</p>
          <Link to="/tickets/create" className="page-button page-button-primary">
            Create ticket
          </Link>
        </div>
      ) : (
        <div className="table-shell">
          <table className="tickets-table">
            <thead>
              <tr>
                <th>Ticket</th>
                <th>Title</th>
                <th>Category</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {tickets.map((ticket) => (
                <tr key={ticket.id}>
                  <td className="ticket-number">#{ticket.id}</td>
                  <td>
                    <div className="ticket-title-cell">
                      <strong>{ticket.title}</strong>
                    </div>
                  </td>
                  <td>{ticket.category}</td>
                  <td>
                    <span className={`badge badge-priority badge-${ticket.priority}`}>{ticket.priority}</span>
                  </td>
                  <td>
                    <span className={`badge badge-status badge-${ticket.status}`}>{ticket.status.replace('_', ' ')}</span>
                  </td>
                  <td>{formatDate(ticket.created_at)}</td>
                  <td>
                    <div className="row-actions">
                      <Link to={`/tickets/${ticket.id}`} className="mini-link">
                        View
                      </Link>
                      <Link to={`/tickets/${ticket.id}/edit`} className="mini-link muted-link">
                        Edit
                      </Link>
                      <button type="button" className="mini-button" onClick={() => setDeleteTarget(ticket.id)}>
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmModal
        isOpen={Boolean(deleteTarget)}
        title="Delete ticket"
        message="This will permanently remove the ticket from your workspace."
        confirmLabel="Delete ticket"
        onCancel={() => setDeleteTarget(null)}
        onConfirm={() => {
          handleDelete(deleteTarget)
          setDeleteTarget(null)
        }}
        loading={deleteMutation.isPending}
      />
    </div>
  )
}

export default Tickets
