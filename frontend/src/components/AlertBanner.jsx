const AlertBanner = ({ type = 'info', message }) => {
  if (!message) {
    return null
  }

  return (
    <div className={`alert-banner alert-${type}`} role="alert">
      {message}
    </div>
  )
}

export default AlertBanner
