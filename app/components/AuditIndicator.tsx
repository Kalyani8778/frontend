// Subtle indicator that all access to this session is audit-logged.
export function AuditIndicator() {
  return (
    <span className="audit-indicator" title="All access to this session is logged">
      <svg
        className="audit-icon"
        width="9" height="9" viewBox="0 0 24 24"
        fill="none" stroke="currentColor" strokeWidth="2.5"
        strokeLinecap="round" strokeLinejoin="round"
        aria-hidden="true"
      >
        <polyline points="9 11 12 14 22 4" />
        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
      </svg>
      Audit Logged
    </span>
  );
}
