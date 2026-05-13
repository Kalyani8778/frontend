// Non-intrusive session expiry modal. Does not affect the existing auth flow —
// it only prompts the user; sign-out is handled by the parent via onReauth.
interface SessionTimeoutModalProps {
  visible: boolean;
  onDismiss: () => void;
  onReauth: () => void;
}

export function SessionTimeoutModal({ visible, onDismiss, onReauth }: SessionTimeoutModalProps) {
  if (!visible) return null;

  return (
    <div
      className="session-modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-label="Session expired"
    >
      <div className="session-modal">
        <div className="session-modal-icon">
          <svg
            width="26" height="26" viewBox="0 0 24 24"
            fill="none" stroke="currentColor" strokeWidth="2"
            strokeLinecap="round" strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        </div>
        <h3 className="session-modal-title">Session Expired</h3>
        <p className="session-modal-body">
          Session expired for security reasons. Please re-authenticate.
        </p>
        <div className="session-modal-actions">
          <button className="session-modal-reauth" onClick={onReauth}>
            Re-authenticate
          </button>
          <button className="session-modal-dismiss" onClick={onDismiss}>
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
}
