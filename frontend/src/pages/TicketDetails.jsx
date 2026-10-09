import { useState } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { deleteTicket, getTicketById } from '../api/ticketApi'
import AlertBanner from '../components/AlertBanner'
import Loading from '../components/Loading'

const formatDate = (dateString) => {
  if (!dateString) return '—'

  return new Date(dateString).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

const TicketDetails = ({ showToast }) => {
  const { id } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const successMessage = location.state?.successMessage
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)

  const {
    data: ticket,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['ticket', id],
    queryFn: () => getTicketById(id),
    enabled: Boolean(id),
  })

  const deleteMutation = useMutation({
    mutationFn: deleteTicket,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tickets'] })
      queryClient.invalidateQueries({ queryKey: ['ticket', id] })
      showToast?.('Ticket deleted successfully', 'success')
      navigate('/tickets', { state: { successMessage: 'Ticket deleted successfully' } })
    },
    onError: (error) => {
      showToast?.(error?.response?.data?.detail || error?.message || 'Unable to delete ticket.', 'error')
    },
  })

  const handleDelete = () => {
    deleteMutation.mutate(Number(id))
  }

  if (isLoading) {
    return <Loading message="Loading ticket details..." />
  }

  if (isError) {
    return (
      <div className="message-box error">
        <h2>Ticket not found</h2>
        <p>{error.message}</p>
      </div>
    )
  }

  return (
    <div className="page-shell">
      <div className="page-header">
        <div>
          <span className="page-eyebrow">Ticket #{ticket.id}</span>
          <h1 className="page-title">{ticket.title}</h1>
          <p className="page-description">Review all information related to this support ticket.</p>
        </div>

        <div className="action-row">
          <Link to="/tickets" className="page-button page-button-secondary">
            ← Back
          </Link>

          <Link to={`/tickets/${ticket.id}/edit`} className="page-button page-button-primary">
            Edit Ticket
          </Link>

          <button
            type="button"
            className="page-button page-button-danger"
            onClick={() => setDeleteModalOpen(true)}
          >
            Delete
          </button>
        </div>
      </div>

      <AlertBanner type="success" message={successMessage} />

      <section className="page-panel">
        <div className="detail-grid">
          <div className="detail-item">
            <span>Category</span>
            <strong>{ticket.category}</strong>
          </div>

          <div className="detail-item">
            <span>Priority</span>
            <strong>
              <span className={`badge badge-priority badge-${ticket.priority}`}>{ticket.priority}</span>
            </strong>
          </div>

          <div className="detail-item">
            <span>Status</span>
            <strong>
              <span className={`badge badge-status badge-${ticket.status}`}>{ticket.status.replace('_', ' ')}</span>
            </strong>
          </div>

          <div className="detail-item">
            <span>Created</span>
            <strong>{formatDate(ticket.created_at)}</strong>
          </div>

          <div className="detail-item">
            <span>Updated</span>
            <strong>{formatDate(ticket.updated_at)}</strong>
          </div>

          <div className="detail-item">
            <span>Ticket ID</span>
            <strong>#TKT-{ticket.id}</strong>
          </div>
        </div>

        <div className="ticket-description-box">
          <span className="page-eyebrow">Description</span>
          {ticket.description}
        </div>
      </section>

      {deleteModalOpen && (
        <div className="modal-overlay">
          <div className="delete-modal">
            <div className="delete-modal-icon">!</div>
            <h3>Delete ticket?</h3>
            <p>This action cannot be undone. Are you sure you want to remove this ticket?</p>

            <div className="delete-modal-actions">
              <button type="button" className="page-button page-button-secondary" onClick={() => setDeleteModalOpen(false)}>
                Cancel
              </button>

              <button
                type="button"
                className="page-button page-button-danger"
                onClick={() => {
                  setDeleteModalOpen(false)
                  handleDelete()
                }}
                disabled={deleteMutation.isPending}
              >
                {deleteMutation.isPending ? 'Deleting...' : 'Delete Ticket'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default TicketDetails
