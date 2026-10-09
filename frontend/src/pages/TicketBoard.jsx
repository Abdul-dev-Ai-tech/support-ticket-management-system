import { useMemo } from 'react'
import { closestCorners, DndContext, PointerSensor, useDroppable, useSensor, useSensors } from '@dnd-kit/core'
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Link } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { getTickets, updateTicket } from '../api/ticketApi'
import AlertBanner from '../components/AlertBanner'
import Loading from '../components/Loading'

const STATUS_ORDER = ['open', 'in_progress', 'resolved', 'closed']

const STATUS_LABELS = {
  open: 'Open',
  in_progress: 'In Progress',
  resolved: 'Resolved',
  closed: 'Closed',
}

const formatBoardDate = (dateString) => {
  if (!dateString) return '—'

  return new Date(dateString).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

const fetchBoardTickets = async () => {
  const firstPage = await getTickets({ page: 1, limit: 100 })
  const totalPages = firstPage?.total_pages ?? 1
  const tickets = [...(firstPage?.items ?? [])]

  if (totalPages > 1) {
    const remainingPages = await Promise.all(
      Array.from({ length: totalPages - 1 }, (_, index) => getTickets({ page: index + 2, limit: 100 })),
    )

    remainingPages.forEach((page) => {
      tickets.push(...(page?.items ?? []))
    })
  }

  return tickets
}

const TicketCard = ({ ticket }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: ticket.id,
    data: { ticket, status: ticket.status },
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`ticket-card status-${ticket.status} ${isDragging ? 'dragging' : ''}`}
      {...attributes}
      {...listeners}
    >
      <div className="kanban-card__top">
        <span className="ticket-card-id">#{ticket.id}</span>
        <span className={`ticket-status-badge status-badge-${ticket.status}`}>
          {STATUS_LABELS[ticket.status] || ticket.status.replace('_', ' ')}
        </span>
      </div>

      <h3 className="ticket-card-title">{ticket.title}</h3>

      <div className="kanban-card__meta">
        <span className="ticket-meta-label">Category</span>
        <span className="ticket-meta-value">{ticket.category}</span>
      </div>

      <div className="kanban-card__meta">
        <span className="ticket-meta-label">Priority</span>
        <span className={`badge priority-${ticket.priority}`}>{ticket.priority}</span>
      </div>

      <div className="kanban-card__meta">
        <span className="ticket-meta-label">Created</span>
        <span className="ticket-created">{formatBoardDate(ticket.created_at)}</span>
      </div>
    </div>
  )
}

const BoardColumn = ({ status, tickets }) => {
  const { setNodeRef, isOver } = useDroppable({
    id: status,
    data: { status },
  })

  return (
    <div ref={setNodeRef} className={`kanban-column ${isOver ? 'is-over' : ''} column-${status}`}>
      <div className="kanban-column__header">
        <h2 className="board-column-title">{STATUS_LABELS[status]}</h2>
        <span className="board-column-count">{tickets.length}</span>
      </div>

      <SortableContext items={tickets.map((ticket) => String(ticket.id))} strategy={verticalListSortingStrategy}>
        <div className="kanban-column__body">
          {!tickets.length ? (
            <div className="kanban-empty-state">Drop a ticket here</div>
          ) : (
            tickets.map((ticket) => <TicketCard key={ticket.id} ticket={ticket} />)
          )}
        </div>
      </SortableContext>
    </div>
  )
}

const TicketBoard = ({ showToast }) => {
  const queryClient = useQueryClient()

  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['ticket-board'],
    queryFn: fetchBoardTickets,
  })

  const tickets = data ?? []

  const boardByStatus = useMemo(
    () =>
      STATUS_ORDER.reduce((columns, status) => {
        columns[status] = tickets.filter((ticket) => ticket.status === status)
        return columns
      }, {}),
    [tickets],
  )

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
  )

  const updateMutation = useMutation({
    mutationFn: ({ id, status }) => updateTicket(id, { status }),
    onMutate: async ({ id, status }) => {
      await queryClient.cancelQueries({ queryKey: ['ticket-board'] })

      const previousTickets = queryClient.getQueryData(['ticket-board'])

      queryClient.setQueryData(['ticket-board'], (current = []) =>
        current.map((ticket) => (ticket.id === id ? { ...ticket, status } : ticket)),
      )

      return { previousTickets }
    },
    onError: (mutationError, _variables, context) => {
      if (context?.previousTickets) {
        queryClient.setQueryData(['ticket-board'], context.previousTickets)
      }

      showToast?.(
        mutationError?.response?.data?.detail ||
          mutationError?.message ||
          'Unable to update ticket status. Please try again.',
        'error',
      )
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tickets'] })
      queryClient.invalidateQueries({ queryKey: ['ticket-board'] })
    },
  })

  const handleDragEnd = (event) => {
    const { active, over } = event

    if (!over) return

    const ticketId = Number(active.id)
    const ticket = tickets.find((item) => item.id === ticketId)

    if (!ticket) return

    const overId = String(over.id)
    const destinationStatus = STATUS_ORDER.includes(overId)
      ? overId
      : over.data?.current?.status || over.data?.current?.ticket?.status

    if (!destinationStatus || destinationStatus === ticket.status) return

    updateMutation.mutate({ id: ticketId, status: destinationStatus })
  }

  if (isLoading) {
    return <Loading message="Loading board..." />
  }

  if (isError) {
    return (
      <div className="message-box error">
        <h2>Unable to load the board</h2>
        <p>{error?.message || 'Please try again.'}</p>
        <button type="button" className="page-button page-button-primary" onClick={() => refetch()}>
          Retry
        </button>
      </div>
    )
  }

  return (
    <div className="page-shell ticket-workflow-section">
      <div className="page-header">
        <div>
          <span className="page-eyebrow">Workflow</span>
          <h1 className="page-title">Ticket Workflow</h1>
          <p className="page-description">Move support requests across the pipeline without breaking the board flow.</p>
        </div>

        <div className="action-row">
          <Link to="/tickets" className="page-button page-button-secondary">
            View tickets
          </Link>
        </div>
      </div>

      <AlertBanner type="error" message={updateMutation.isError ? 'Unable to update ticket status.' : ''} />

      <section className="page-panel">
        <div className="ticket-board-scroll">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragEnd={handleDragEnd}
          >
            <div className="ticket-board">
              {STATUS_ORDER.map((status) => (
                <BoardColumn key={status} status={status} tickets={boardByStatus[status] ?? []} />
              ))}
            </div>
          </DndContext>
        </div>
      </section>
    </div>
  )
}

export default TicketBoard
