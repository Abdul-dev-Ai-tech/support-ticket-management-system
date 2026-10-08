const ToastContainer = ({ toasts, onDismiss }) => {
  if (!toasts.length) {
    return null
  }

  return (
    <div className="toast-container" aria-live="polite" aria-atomic="true">
      {toasts.map((toast) => (
        <div key={toast.id} className={`toast toast-${toast.type}`}>
          <span>{toast.message}</span>
          <button type="button" onClick={() => onDismiss(toast.id)} aria-label="Dismiss message">
            ×
          </button>
        </div>
      ))}
    </div>
  )
}

export default ToastContainer
