const Profile = ({ user }) => {
  if (!user) {
    return null
  }

  return (
    <div className="page-shell">
      <div className="page-header">
        <div>
          <span className="page-eyebrow">Account</span>
          <h1 className="page-title">Profile</h1>
          <p className="page-description">Your TicketFlow account information.</p>
        </div>
      </div>

      <section className="page-panel">
        <div className="profile-overview">
          <div className="avatar-large">{user.name?.charAt(0)?.toUpperCase() || 'U'}</div>

          <div className="profile-meta">
            <div className="profile-row">
              <span className="profile-label">Name</span>
              <strong>{user.name}</strong>
            </div>
            <div className="profile-row">
              <span className="profile-label">Email</span>
              <strong>{user.email}</strong>
            </div>
            <div className="profile-row">
              <span className="profile-label">Role</span>
              <strong>{user.role || 'User'}</strong>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Profile
