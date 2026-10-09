const ConfirmModal = ({ isOpen, title, message, confirmLabel = 'Delete', onCancel, onConfirm, loading = false }) => {
  if (!isOpen) {
    return null
  }

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true">
      <div className="modal-card">
        <h3>{title}</h3>
        <p>{message}</p>

        <div className="modal-actions">
          <button type="button" className="page-button page-button-secondary" onClick={onCancel} disabled={loading}>
            Cancel
          </button>
          <button type="button" className="page-button page-button-danger" onClick={onConfirm} disabled={loading}>
            {loading ? 'Deleting...' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmModal
