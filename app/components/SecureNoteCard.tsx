import React from "react";

interface SecureNoteCardProps {
  children: React.ReactNode;
  isProtected?: boolean;
}

// Wraps a note/reply with a lock indicator when it contains sensitive content.
export function SecureNoteCard({ children, isProtected = false }: SecureNoteCardProps) {
  return (
    <div className={`secure-note-card${isProtected ? " protected" : ""}`}>
      {isProtected && (
        <span className="secure-note-lock" title="Protected note — access is logged">
          <svg
            width="10" height="10" viewBox="0 0 24 24"
            fill="none" stroke="currentColor" strokeWidth="2.5"
            strokeLinecap="round" strokeLinejoin="round"
            aria-hidden="true"
          >
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
          Protected
        </span>
      )}
      {children}
    </div>
  );
}
