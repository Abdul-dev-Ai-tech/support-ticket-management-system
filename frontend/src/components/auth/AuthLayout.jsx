import "../../styles/auth.css";

function AuthLayout({ children, type = 'login' }) {
  const isRegister = type === 'register';

  return (
    <div className="premium-auth-page">
      <div className="auth-orb auth-orb-one"></div>
      <div className="auth-orb auth-orb-two"></div>

      <div className="premium-auth-container">
        <section className={`premium-auth-visual ${isRegister ? 'register-auth-visual' : 'login-auth-visual'}`}>
          <div className="premium-auth-brand">
            <div className="premium-auth-logo">T</div>
            <strong>TicketFlow</strong>
          </div>

          <div className="premium-auth-copy">
            <span className="auth-eyebrow">
              {isRegister ? 'JOIN TICKETFLOW' : 'SMARTER SUPPORT'}
            </span>

            <h2>
              {isRegister ? 'Create Your Account' : 'Streamline Support Effortlessly'}
            </h2>

            <p>
              {isRegister
                ? 'Create your account and start managing support requests, tracking progress, organizing priorities, collaborating efficiently, and resolving customer issues faster from one modern workspace designed to make support simple and organized.'
                : 'Manage support requests, track progress, stay organized, collaborate more efficiently, and resolve customer issues faster from one powerful workspace built to keep your support process clear, simple, and under control.'}
            </p>

            <div className="auth-feature-list">
              <div>
                <span>✓</span>
                Organize support requests
              </div>

              <div>
                <span>✓</span>
                Track progress in real time
              </div>

              <div>
                <span>✓</span>
                Resolve issues faster
              </div>
            </div>
          </div>
        </section>

        <section className="premium-auth-form-panel">{children}</section>
      </div>
    </div>
  );
}

export default AuthLayout;
