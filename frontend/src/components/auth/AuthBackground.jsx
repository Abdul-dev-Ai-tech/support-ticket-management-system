const AuthBackground = () => {
  return (
    <div className="auth-background" aria-hidden="true">
      <div className="auth-bg__orb orb-one" />
      <div className="auth-bg__orb orb-two" />
      <div className="auth-bg__orb orb-three" />
      <div className="auth-bg__orb orb-four" />

      <div className="auth-illustration">
        <div className="auth-illustration__panel panel-main">
          <div className="panel-header">
            <span className="panel-dot" />
            <span className="panel-dot" />
            <span className="panel-dot" />
          </div>

          <div className="panel-graph">
            <span className="bar bar-one" />
            <span className="bar bar-two" />
            <span className="bar bar-three" />
            <span className="bar bar-four" />
          </div>

          <div className="panel-metrics">
            <span />
            <span />
            <span />
          </div>
        </div>

        <div className="auth-illustration__panel panel-side">
          <div className="avatar-pill" />
          <div className="status-line line-short" />
          <div className="status-line line-medium" />
          <div className="status-line line-long" />
        </div>
      </div>
    </div>
  )
}

export default AuthBackground
