const LoadingSpinner = ({ message = 'Loading...', compact = false }) => {
  return (
    <div className={`loading-state ${compact ? 'compact' : ''}`} role="status" aria-live="polite">
      <div className="spinner" aria-hidden="true" />
      <span>{message}</span>
    </div>
  )
}

export default LoadingSpinner
