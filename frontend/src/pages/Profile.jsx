const Profile = ({ user }) => {
  if (!user) {
    return null
  }

  return (
    <div className="page-card profile-card">
      <div className="page-header compact">
        <div>
          <p className="eyebrow">Account</p>
          <h1>My Profile</h1>
        </div>
      </div>

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
    </div>
  )
}

export default Profile
