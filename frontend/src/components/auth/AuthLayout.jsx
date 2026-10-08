import AuthBackground from './AuthBackground'

const AuthLayout = ({ eyebrow, title, subtitle, children, footer }) => {
  return (
    <div className="auth-page">
      <AuthBackground />

      <div className="auth-shell-inner">
        <div className="auth-card glass-card">
          <div className="auth-brand" aria-label="TicketFlow brand">
            <span className="auth-brand__mark">T</span>
            <span>TicketFlow</span>
          </div>

          <div className="auth-header">
            {eyebrow ? <p className="auth-eyebrow">{eyebrow}</p> : null}
            <h1>{title}</h1>
            {subtitle ? <p className="auth-subtitle">{subtitle}</p> : null}
          </div>

          {children}

          {footer ? <div className="auth-footer">{footer}</div> : null}
        </div>
      </div>
    </div>
  )
}

export default AuthLayout
