const ErrorState = ({ title = 'Something went wrong', message, onRetry }) => {
  return (
    <div className="error-state-panel">
      <div className="error-state-icon">!</div>
      <h3>{title}</h3>
      <p>{message || 'Please try again.'}</p>
      {onRetry ? (
        <button type="button" className="primary-button" onClick={onRetry}>
          Try again
        </button>
      ) : null}
    </div>
  )
}

export default ErrorState
