const EmptyState = ({ title, message, actionLabel, onAction }) => {
  return (
    <div className="empty-state-panel">
      <div className="empty-state-icon">•</div>
      <h3>{title}</h3>
      <p>{message}</p>
      {actionLabel && onAction ? (
        <button type="button" className="primary-button" onClick={onAction}>
          {actionLabel}
        </button>
      ) : null}
    </div>
  )
}

export default EmptyState
