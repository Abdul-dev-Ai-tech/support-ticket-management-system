import { useState } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { deleteTicket, getTicketById } from '../api/ticketApi'
import AlertBanner from '../components/AlertBanner'
import ConfirmModal from '../components/ConfirmModal'
import Loading from '../components/Loading'

const TicketDetails = ({ showToast }) => {
  const { id } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const successMessage = location.state?.successMessage
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

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
    <div className="page-card detail-card">
      <div className="page-header compact">
        <div>
          <p className="eyebrow">Ticket #{ticket.id}</p>
          <h1>{ticket.title}</h1>
        </div>

        <div className="detail-actions">
          <Link to={`/tickets/${ticket.id}/edit`} className="secondary-button">
            Edit ticket
          </Link>
          <button type="button" className="danger-button danger-outline" onClick={() => setDeleteDialogOpen(true)}>
            {deleteMutation.isPending ? 'Deleting...' : 'Delete ticket'}
          </button>
        </div>
      </div>

      <AlertBanner type="success" message={successMessage} />

      <div className="detail-grid">
        <div className="detail-pill">
          <p className="label">Category</p>
          <p>{ticket.category}</p>
        </div>
        <div className="detail-pill">
          <p className="label">Priority</p>
          <p>{ticket.priority}</p>
        </div>
        <div className="detail-pill">
          <p className="label">Status</p>
          <p>{ticket.status}</p>
        </div>
      </div>

      <div className="description-box">
        <p className="label">Description</p>
        <p>{ticket.description}</p>
      </div>

      <ConfirmModal
        isOpen={deleteDialogOpen}
        title="Delete ticket"
        message="This action cannot be undone. Are you sure you want to remove this ticket?"
        confirmLabel="Delete ticket"
        onCancel={() => setDeleteDialogOpen(false)}
        onConfirm={() => {
          setDeleteDialogOpen(false)
          handleDelete()
        }}
        loading={deleteMutation.isPending}
      />
    </div>
  )
}

export default TicketDetails
