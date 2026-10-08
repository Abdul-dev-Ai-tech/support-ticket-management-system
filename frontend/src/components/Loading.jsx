const Loading = ({ message = 'Loading...' }) => {
  return (
    <div className="loading" role="status" aria-live="polite">
      <div className="loading-spinner" aria-hidden="true" />
      <p>{message}</p>
    </div>
  )
}

export default Loading
