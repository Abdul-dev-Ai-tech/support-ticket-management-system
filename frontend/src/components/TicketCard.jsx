import { Link } from 'react-router-dom'

const TicketCard = ({ ticket, onDelete }) => {
  return (
    <article className="ticket-card">
      <div className="ticket-card-header">
        <div>
          <p className="ticket-id">Ticket #{ticket.id}</p>
          <h3>{ticket.title}</h3>
        </div>
        <span className={`badge badge-${ticket.status}`}>{ticket.status}</span>
      </div>

      <div className="ticket-meta">
        <span>
          <strong>Category:</strong> {ticket.category}
        </span>
        <span>
          <strong>Priority:</strong> {ticket.priority}
        </span>
      </div>

      <div className="ticket-actions">
        <Link to={`/tickets/${ticket.id}`}>View details</Link>
        <button
          type="button"
          className="text-button danger-button"
          onClick={() => onDelete(ticket.id)}
        >
          Delete
        </button>
      </div>
    </article>
  )
}

export default TicketCard
